// =============================================
// SessionsGateway (Socket.io)
// Maneja conexiones y desconexiones en tiempo real
// Los clientes se conectan al WebSocket para rastrear sesiones
// =============================================

import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SessionsService } from './sessions.service';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/sessions',
})
export class SessionsGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    constructor(private sessionsService: SessionsService) { }

    // Se ejecuta cuando un cliente se conecta
    async handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        const userEmail = client.handshake.query.userEmail as string;

        if (userId && userEmail) {
            await this.sessionsService.create({
                userId: parseInt(userId),
                userEmail,
                socketId: client.id,
                ipAddress: client.handshake.address,
                deviceInfo: client.handshake.headers['user-agent'],
            });

            // Notificar a todos los clientes que hay una nueva sesion
            this.server.emit('session:connected', { userId, userEmail, socketId: client.id });
            console.log(`Usuario conectado: ${userEmail} (${client.id})`);
        }
    }

    // Se ejecuta cuando un cliente se desconecta
    async handleDisconnect(client: Socket) {
        await this.sessionsService.disconnect(client.id);

        this.server.emit('session:disconnected', { socketId: client.id });
        console.log(`Socket desconectado: ${client.id}`);
    }
}