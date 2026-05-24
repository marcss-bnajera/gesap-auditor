import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: 'auditor@gesap.gt', description: 'Correo del auditor' })
    @IsNotEmpty({ message: 'El correo es obligatorio' })
    @IsEmail({}, { message: 'El correo debe tener formato valido (ejemplo@dominio.com)' })
    @MaxLength(100, { message: 'El correo no puede tener mas de 100 caracteres' })
    email: string;

    @ApiProperty({ example: 'GESAP2024!', description: 'Contraseña del auditor' })
    @IsNotEmpty({ message: 'La contrasena es obligatoria' })
    @IsString({ message: 'La contrasena debe ser texto' })
    password: string;
}
