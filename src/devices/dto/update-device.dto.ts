// =============================================
// DTO para actualizar un Dispositivo
// =============================================

import { IsOptional, IsString, IsBoolean, MaxLength, Matches } from 'class-validator';

export class UpdateDeviceDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    deviceName?: string;

    @IsOptional()
    @IsString()
    @MaxLength(45)
    ipAddress?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    location?: string;

    @IsOptional()
    @IsBoolean({ message: 'isActive debe ser true o false' })
    isActive?: boolean;
}