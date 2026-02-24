import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { Pharmacy } from '../entities/pharmacy.entity';

@Controller('pharmacies')
export class PharmacyController {
  
  @Get()
  findAll() {
    return { message: 'Pharmacy service is running', data: [] };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return { message: `Pharmacy ${id}`, id };
  }

  @Post()
  create(@Body() body: any) {
    return { message: 'Create pharmacy', data: body };
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return { message: `Update pharmacy ${id}`, data: body };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return { message: `Delete pharmacy ${id}` };
  }
}
