// =============================================
// SchedulesController
// CRUD de horarios de trabajo
// =============================================

import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { SchedulesService } from './schedules.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@Controller('schedules')
@UseGuards(JwtAuthGuard)
export class SchedulesController {
    constructor(private schedulesService: SchedulesService) { }

    @Post()
    create(@Body() dto: CreateScheduleDto) {
        return this.schedulesService.create(dto);
    }

    @Get()
    findAll() {
        return this.schedulesService.findAll();
    }

    @Get('user/:userId')
    findByUser(@Param('userId', ParseIntPipe) userId: number) {
        return this.schedulesService.findByUser(userId);
    }

    @Put(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateScheduleDto) {
        return this.schedulesService.update(id, dto);
    }

    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.schedulesService.remove(id);
    }
}