// =============================================
// Modulo principal de GESAP Auditor
// =============================================

import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { SessionsModule } from './sessions/sessions.module';
import { SchedulesModule } from './schedules/schedules.module';
import { DevicesModule } from './devices/devices.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        AuditLogsModule,
        SessionsModule,
        SchedulesModule,
        DevicesModule,
    ],
})
export class AppModule { }