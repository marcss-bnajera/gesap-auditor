import { Module } from '@nestjs/common';
import { PatientAccountsService } from './patient-accounts.service';
import { PatientAccountsController } from './patient-accounts.controller';

@Module({
    controllers: [PatientAccountsController],
    providers: [PatientAccountsService],
})
export class PatientAccountsModule { }
