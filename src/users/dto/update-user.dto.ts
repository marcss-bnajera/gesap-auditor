import {
    IsEmail, IsString, IsInt, IsOptional, IsEnum,
    MinLength, MaxLength, Matches, Min, IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AvailabilityStatus } from './create-user.dto';

export class UpdateUserDto {
    @ApiPropertyOptional({ example: 'nuevo.email@gesap.gt' })
    @IsOptional()
    @IsEmail()
    @MaxLength(100)
    email?: string;

    @ApiPropertyOptional({ example: 'Ana' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    firstName?: string;

    @ApiPropertyOptional({ example: 'Cifuentes' })
    @IsOptional()
    @IsString()
    @MinLength(2)
    @MaxLength(50)
    lastName?: string;

    @ApiPropertyOptional({ example: 5, description: 'ID del rol' })
    @IsOptional()
    @IsInt()
    @Min(1)
    roleId?: number;

    @ApiPropertyOptional({ example: 1, description: 'ID del hospital' })
    @IsOptional()
    @IsInt()
    @Min(1)
    hospitalId?: number;

    @ApiPropertyOptional({ example: 'FLOTA-GT-02' })
    @IsOptional()
    @IsString()
    @MaxLength(50)
    fleetId?: string;

    @ApiPropertyOptional({ enum: AvailabilityStatus, example: 'BUSY' })
    @IsOptional()
    @IsEnum(AvailabilityStatus)
    availabilityStatus?: AvailabilityStatus;

    @ApiPropertyOptional({ example: true, description: 'true = activo, false = desactivado' })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

export class ChangePasswordDto {
    @ApiPropertyOptional({ example: 'OldPass123!' })
    @IsString()
    @MinLength(1)
    currentPassword: string;

    @ApiPropertyOptional({ example: 'NewPass456!', description: 'Mín. 8 chars, mayúscula, minúscula, número, especial' })
    @IsString()
    @MinLength(8)
    @MaxLength(50)
    @Matches(/[A-Z]/, { message: 'La nueva contrasena debe tener al menos una mayuscula' })
    @Matches(/[a-z]/, { message: 'La nueva contrasena debe tener al menos una minuscula' })
    @Matches(/[0-9]/, { message: 'La nueva contrasena debe tener al menos un numero' })
    @Matches(/[!@#$%^&*]/, { message: 'La nueva contrasena debe tener al menos un caracter especial' })
    newPassword: string;
}
