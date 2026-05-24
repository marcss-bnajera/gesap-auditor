import { IsOptional, IsString, IsBoolean, MaxLength, Matches } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateDeviceDto {
    @ApiPropertyOptional({ example: 'Computadora Recepción 2' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    deviceName?: string;

    @ApiPropertyOptional({ example: '192.168.1.101' })
    @IsOptional()
    @IsString()
    @MaxLength(45)
    ipAddress?: string;

    @ApiPropertyOptional({ example: 'Área de urgencias' })
    @IsOptional()
    @IsString()
    @MaxLength(100)
    location?: string;

    @ApiPropertyOptional({ example: true, description: 'true = activo, false = revocado' })
    @IsOptional()
    @IsBoolean({ message: 'isActive debe ser true o false' })
    isActive?: boolean;
}
