import {
    WebSocketGateway, WebSocketServer,
    OnGatewayConnection, OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service';

@WebSocketGateway({ cors: { origin: '*' }, namespace: '/sessions', path: '/auditor-ws' })
@Injectable()
export class SessionsGateway
    implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit, OnModuleDestroy
{
    @WebSocketServer() server: Server;

    private userSockets = new Map<number, Set<Socket>>();
    private socketUsers = new Map<string, number>();
    private checkInterval: ReturnType<typeof setInterval>;

    constructor(private prisma: PrismaService) {}

    onModuleInit() {
        this.checkInterval = setInterval(() => this.checkKickedSessions(), 4000);
    }

    onModuleDestroy() {
        clearInterval(this.checkInterval);
    }

    handleConnection(client: Socket) {
        try {
            const token =
                (client.handshake.auth?.token as string) ||
                (client.handshake.query?.token as string);
            if (!token) return;
            const payload = jwt.verify(token, process.env.JWT_SECRET!) as unknown as { sub: number };
            const userId = Number(payload.sub);
            this.socketUsers.set(client.id, userId);
            if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
            this.userSockets.get(userId)!.add(client);
        } catch {
            // token inválido: socket sin identificación (auditores sin auth, sólo reciben sessions:changed)
        }
    }

    handleDisconnect(client: Socket) {
        const userId = this.socketUsers.get(client.id);
        if (userId === undefined) return;
        this.socketUsers.delete(client.id);
        const sockets = this.userSockets.get(userId);
        if (sockets) {
            sockets.delete(client);
            if (sockets.size === 0) this.userSockets.delete(userId);
        }
    }

    /** Llamado por SessionsService después de un kick — notifica a todos los auditores conectados */
    notifySessionsChanged() {
        this.server.emit('sessions:changed');
    }

    private async checkKickedSessions() {
        if (this.userSockets.size === 0) return;
        try {
            const userIds = [...this.userSockets.keys()];
            const active = await this.prisma.loginSession.findMany({
                where: { userId: { in: userIds }, isActive: true },
                select: { userId: true },
            });
            const activeIds = new Set(active.map((s) => s.userId));
            for (const userId of userIds.filter((id) => !activeIds.has(id))) {
                const sockets = this.userSockets.get(userId);
                if (!sockets) continue;
                for (const socket of sockets) {
                    this.socketUsers.delete(socket.id);
                    socket.emit('session:kicked', { message: 'Tu sesión ha sido cerrada por un administrador.' });
                    socket.disconnect();
                }
                this.userSockets.delete(userId);
            }
        } catch {
            // ignorar errores de BD transitorios
        }
    }
}
