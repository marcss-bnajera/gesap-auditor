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
import { DashboardModule } from './dashboard/dashboard.module';
import { HospitalsModule } from './hospitals/hospitals.module';
import { PatientAccountsModule } from './patient-accounts/patient-accounts.module';
import { EmergenciesModule } from './emergencies/emergencies.module';
import { UsersModule } from './users/users.module';

@Module({
    imports: [
        PrismaModule,
        AuthModule,
        AuditLogsModule,
        SessionsModule,
        SchedulesModule,
        DevicesModule,
        DashboardModule,
        HospitalsModule,
        PatientAccountsModule,
        EmergenciesModule,
        UsersModule,
    ],
})
export class AppModule { }