import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { PatientService } from '../services/patient.service';
import { CreatePatientDto, UpdatePatientDto, PatientQueryDto } from '../dto/patient.dto';
import { Patient } from '../entities/patient.entity';

@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientService.create(createPatientDto);
  }

  @Get()
  async findAll(@Query() query: PatientQueryDto): Promise<{ data: Patient[]; total: number; page: number; limit: number }> {
    return this.patientService.findAll(query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Patient> {
    return this.patientService.findOne(id);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string): Promise<Patient | null> {
    return this.patientService.findByUserId(userId);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.patientService.remove(id);
  }

  @Put(':id/insurance')
  async updateInsurance(
    @Param('id') id: string,
    @Body() body: { insuranceProvider: string; insurancePolicyNumber: string },
  ): Promise<Patient> {
    return this.patientService.updateInsuranceInfo(
      id,
      body.insuranceProvider,
      body.insurancePolicyNumber,
    );
  }

  @Put(':id/emergency-contact')
  async updateEmergencyContact(
    @Param('id') id: string,
    @Body() body: {
      emergencyContactName: string;
      emergencyContactPhone: string;
      emergencyContactRelationship: string;
    },
  ): Promise<Patient> {
    return this.patientService.updateEmergencyContact(
      id,
      body.emergencyContactName,
      body.emergencyContactPhone,
      body.emergencyContactRelationship,
    );
  }
}
