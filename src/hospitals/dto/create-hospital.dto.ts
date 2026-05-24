import { IsString, IsEnum, IsOptional, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum HospitalLevel {
    REFERENCIA_NACIONAL = 'REFERENCIA_NACIONAL',
    ESPECIALIZADO = 'ESPECIALIZADO',
    REGIONAL = 'REGIONAL',
    DEPARTAMENTAL = 'DEPARTAMENTAL',
    DISTRITAL = 'DISTRITAL',
    CENTRO_SALUD_A = 'CENTRO_SALUD_A',
    CENTRO_SALUD_B = 'CENTRO_SALUD_B',
    CAP = 'CAP',
}

export class CreateHospitalDto {
    @ApiProperty({ example: 'HNSJD', description: 'Código único del hospital (máx. 10 caracteres)' })
    @IsString()
    @MaxLength(10)
    code: string;

    @ApiProperty({ example: 'Hospital Nacional San Juan de Dios', description: 'Nombre completo del hospital' })
    @IsString()
    @MaxLength(200)
    name: string;

    @ApiProperty({ enum: HospitalLevel, example: 'REFERENCIA_NACIONAL', description: 'Nivel del hospital según clasificación MSPAS' })
    @IsEnum(HospitalLevel)
    level: HospitalLevel;

    @ApiProperty({ example: 'Guatemala', description: 'Departamento donde se ubica' })
    @IsString()
    @MaxLength(50)
    department: string;

    @ApiProperty({ example: 'Guatemala', description: 'Municipio donde se ubica' })
    @IsString()
    @MaxLength(100)
    municipality: string;

    @ApiPropertyOptional({ example: '1ª Avenida 10-50, Zona 1' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    address?: string;

    @ApiPropertyOptional({ example: '22321234' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    phone?: string;
}
