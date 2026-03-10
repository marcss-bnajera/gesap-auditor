// =============================================
// DTO para registrar un Dispositivo Autorizado
// macAddress en formato XX:XX:XX:XX:XX:XX
// =============================================

import { IsNotEmpty, IsString, IsOptional, MaxLength, Matches } from 'class-validator';

export class RegisterDeviceDto {
    @IsNotEmpty({ message: 'El nombre del dispositivo es obligatorio' })
    @IsString({ message: 'El nombre debe ser texto' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    deviceName: string;

    @IsNotEmpty({ message: 'La direccion MAC es obligatoria' })
    @IsString({ message: 'La MAC debe ser texto' })
    @Matches(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, { message: 'La MAC debe tener formato XX:XX:XX:XX:XX:XX' })
    macAddress: string;

    @IsOptional()
    @IsString({ message: 'La IP debe ser texto' })
    @MaxLength(45, { message: 'La IP no puede exceder 45 caracteres' })
    ipAddress?: string;

    @IsOptional()
    @IsString({ message: 'La ubicacion debe ser texto' })
    @MaxLength(100, { message: 'La ubicacion no puede exceder 100 caracteres' })
    location?: string;
}