// =============================================
// DevicesController
// Whitelist de dispositivos autorizados
// =============================================

import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { RegisterDeviceDto } from './dto/register-device.dto';
import { UpdateDeviceDto } from './dto/update-device.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('devices')
@UseGuards(JwtAuthGuard)
export class DevicesController {
    constructor(private devicesService: DevicesService) { }

    @Post()
    register(@CurrentUser('id') userId: number, @Body() dto: RegisterDeviceDto) {
        return this.devicesService.register(userId, dto);
    }

    @Get()
    findAll() {
        return this.devicesService.findAll();
    }

    @Get('active')
    findActive() {
        return this.devicesService.findActive();
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateDeviceDto) {
        return this.devicesService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.devicesService.remove(id);
    }
}