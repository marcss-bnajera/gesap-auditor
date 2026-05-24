import { IsNotEmpty, IsString, IsOptional, MaxLength, Matches } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDeviceDto {
    @ApiProperty({ example: 'Computadora Recepción 1', description: 'Nombre descriptivo del dispositivo' })
    @IsNotEmpty({ message: 'El nombre del dispositivo es obligatorio' })
    @IsString({ message: 'El nombre debe ser texto' })
    @MaxLength(100, { message: 'El nombre no puede exceder 100 caracteres' })
    deviceName: string;

    @ApiProperty({ example: 'AA:BB:CC:DD:EE:FF', description: 'Dirección MAC del dispositivo (formato XX:XX:XX:XX:XX:XX)' })
    @IsNotEmpty({ message: 'La direccion MAC es obligatoria' })
    @IsString({ message: 'La MAC debe ser texto' })
    @Matches(/^([0-9A-Fa-f]{2}:){5}[0-9A-Fa-f]{2}$/, { message: 'La MAC debe tener formato XX:XX:XX:XX:XX:XX' })
    macAddress: string;

    @ApiPropertyOptional({ example: '192.168.1.100', description: 'Dirección IP del dispositivo (IPv4 o IPv6)' })
    @IsOptional()
    @IsString({ message: 'La IP debe ser texto' })
    @MaxLength(45, { message: 'La IP no puede exceder 45 caracteres' })
    ipAddress?: string;

    @ApiPropertyOptional({ example: 'Área de recepción — ventanilla 1' })
    @IsOptional()
    @IsString({ message: 'La ubicacion debe ser texto' })
    @MaxLength(100, { message: 'La ubicacion no puede exceder 100 caracteres' })
    location?: string;
}
