// =============================================
// SessionsModule
// =============================================

import { Module } from '@nestjs/common';
import { SessionsService } from './sessions.service';
import { SessionsGateway } from './sessions.gateway';
import { SessionsController } from './sessions.controller';

@Module({
    controllers: [SessionsController],
    providers: [SessionsService, SessionsGateway],
    exports: [SessionsService],
})
export class SessionsModule { }