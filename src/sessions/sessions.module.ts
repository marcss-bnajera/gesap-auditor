// =============================================
// SessionsModule
// Incluye el gateway de Socket.io para sesiones
// =============================================

import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsGateway } from './sessions.gateway';

@Module({
    providers: [SessionsService, SessionsGateway],
    exports: [SessionsService],
})
export class SessionsModule { }