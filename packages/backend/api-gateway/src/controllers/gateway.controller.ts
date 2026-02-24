import { Controller, Get, Post, Put, Delete, Patch, Body, Param, Query, Headers, HttpCode, HttpStatus } from '@nestjs/common';
import { ProxyService } from '../services/proxy.service';

@Controller('api')
export class GatewayController {
  constructor(private readonly proxyService: ProxyService) {}

  // Health check
  @Get('health')
  health() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  // ============================================================
  // AUTH SERVICE
  // ============================================================
  
  @Post('v1/auth/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: any) {
    return this.proxyService.proxy('auth', 'POST', '/api/v1/auth/register', body);
  }

  @Post('v1/auth/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: any) {
    return this.proxyService.proxy('auth', 'POST', '/api/v1/auth/login', body);
  }

  @Post('v1/auth/refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() body: any) {
    return this.proxyService.proxy('auth', 'POST', '/api/v1/auth/refresh', body);
  }

  @Get('v1/auth/me')
  async getMe(@Headers('authorization') auth: string) {
    return this.proxyService.proxy('auth', 'GET', '/api/v1/auth/me', {}, auth);
  }

  @Post('v1/auth/logout')
  async logout(@Headers('authorization') auth: string) {
    return this.proxyService.proxy('auth', 'POST', '/api/v1/auth/logout', {}, auth);
  }

  // ============================================================
  // PATIENT SERVICE
  // ============================================================

  @Post('v1/patients')
  @HttpCode(HttpStatus.CREATED)
  async createPatient(@Body() body: any) {
    return this.proxyService.proxy('patient', 'POST', '/patients', body);
  }

  @Get('v1/patients')
  async getPatients() {
    return this.proxyService.proxy('patient', 'GET', '/patients');
  }

  @Get('v1/patients/:id')
  async getPatient(@Param('id') id: string) {
    return this.proxyService.proxy('patient', 'GET', `/patients/${id}`);
  }

  @Put('v1/patients/:id')
  async updatePatient(@Param('id') id: string, @Body() body: any) {
    return this.proxyService.proxy('patient', 'PUT', `/patients/${id}`, body);
  }

  @Delete('v1/patients/:id')
  async deletePatient(@Param('id') id: string) {
    return this.proxyService.proxy('patient', 'DELETE', `/patients/${id}`);
  }

  // ============================================================
  // PROVIDER SERVICE
  // ============================================================

  @Post('v1/providers')
  @HttpCode(HttpStatus.CREATED)
  async createProvider(@Body() body: any) {
    return this.proxyService.proxy('provider', 'POST', '/providers', body);
  }

  @Get('v1/providers')
  async getProviders(@Query('specialization') specialization?: string, @Query('city') city?: string) {
    const query = new URLSearchParams();
    if (specialization) query.append('specialization', specialization);
    if (city) query.append('city', city);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.proxyService.proxy('provider', 'GET', `/providers${queryString}`);
  }

  @Get('v1/providers/:id')
  async getProvider(@Param('id') id: string) {
    return this.proxyService.proxy('provider', 'GET', `/providers/${id}`);
  }

  @Get('v1/providers/nearby/:latitude/:longitude')
  async getNearbyProviders(@Param('latitude') lat: string, @Param('longitude') lng: string, @Query('radius') radius?: string) {
    const query = radius ? `?radius=${radius}` : '';
    return this.proxyService.proxy('provider', 'GET', `/providers/nearby/${lat}/${lng}${query}`);
  }

  @Put('v1/providers/:id')
  async updateProvider(@Param('id') id: string, @Body() body: any) {
    return this.proxyService.proxy('provider', 'PUT', `/providers/${id}`, body);
  }

  @Put('v1/providers/:id/verify')
  async verifyProvider(@Param('id') id: string, @Body() body: any) {
    return this.proxyService.proxy('provider', 'PUT', `/providers/${id}/verify`, body);
  }

  // ============================================================
  // APPOINTMENT SERVICE
  // ============================================================

  @Post('v1/appointments')
  @HttpCode(HttpStatus.CREATED)
  async createAppointment(@Body() body: any) {
    return this.proxyService.proxy('appointment', 'POST', '/appointments', body);
  }

  @Get('v1/appointments')
  async getAppointments(@Query('patientId') patientId?: string, @Query('providerId') providerId?: string) {
    const query = new URLSearchParams();
    if (patientId) query.append('patientId', patientId);
    if (providerId) query.append('providerId', providerId);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.proxyService.proxy('appointment', 'GET', `/appointments${queryString}`);
  }

  @Get('v1/appointments/:id')
  async getAppointment(@Param('id') id: string) {
    return this.proxyService.proxy('appointment', 'GET', `/appointments/${id}`);
  }

  @Put('v1/appointments/:id')
  async updateAppointment(@Param('id') id: string, @Body() body: any) {
    return this.proxyService.proxy('appointment', 'PUT', `/appointments/${id}`, body);
  }

  @Delete('v1/appointments/:id')
  async deleteAppointment(@Param('id') id: string) {
    return this.proxyService.proxy('appointment', 'DELETE', `/appointments/${id}`);
  }

  @Patch('v1/appointments/:id/status')
  async updateAppointmentStatus(@Param('id') id: string, @Body() body: any) {
    return this.proxyService.proxy('appointment', 'PATCH', `/appointments/${id}/status`, body);
  }

  // ============================================================
  // HOSPITAL SERVICE
  // ============================================================

  @Post('v1/hospitals')
  @HttpCode(HttpStatus.CREATED)
  async createHospital(@Body() body: any) {
    return this.proxyService.proxy('hospital', 'POST', '/hospitals', body);
  }

  @Get('v1/hospitals')
  async getHospitals(@Query('city') city?: string, @Query('specialization') specialization?: string) {
    const query = new URLSearchParams();
    if (city) query.append('city', city);
    if (specialization) query.append('specialization', specialization);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.proxyService.proxy('hospital', 'GET', `/hospitals${queryString}`);
  }

  @Get('v1/hospitals/:id')
  async getHospital(@Param('id') id: string) {
    return this.proxyService.proxy('hospital', 'GET', `/hospitals/${id}`);
  }

  @Get('v1/hospitals/:id/beds')
  async getHospitalBeds(@Param('id') id: string) {
    return this.proxyService.proxy('hospital', 'GET', `/hospitals/${id}/beds`);
  }

  @Put('v1/hospitals/:id')
  async updateHospital(@Param('id') id: string, @Body() body: any) {
    return this.proxyService.proxy('hospital', 'PUT', `/hospitals/${id}`, body);
  }

  // ============================================================
  // PHARMACY SERVICE
  // ============================================================

  @Post('v1/pharmacies')
  @HttpCode(HttpStatus.CREATED)
  async createPharmacy(@Body() body: any) {
    return this.proxyService.proxy('pharmacy', 'POST', '/pharmacies', body);
  }

  @Get('v1/pharmacies')
  async getPharmacies(@Query('city') city?: string) {
    const query = city ? `?city=${city}` : '';
    return this.proxyService.proxy('pharmacy', 'GET', `/pharmacies${query}`);
  }

  @Get('v1/pharmacies/:id')
  async getPharmacy(@Param('id') id: string) {
    return this.proxyService.proxy('pharmacy', 'GET', `/pharmacies/${id}`);
  }

  @Get('v1/pharmacies/:id/inventory')
  async getPharmacyInventory(@Param('id') id: string) {
    return this.proxyService.proxy('pharmacy', 'GET', `/pharmacies/${id}/inventory`);
  }

  @Post('v1/pharmacies/:id/orders')
  @HttpCode(HttpStatus.CREATED)
  async createPharmacyOrder(@Param('id') id: string, @Body() body: any) {
    return this.proxyService.proxy('pharmacy', 'POST', `/pharmacies/${id}/orders`, body);
  }

  // ============================================================
  // LAB SERVICE
  // ============================================================

  @Post('v1/labs')
  @HttpCode(HttpStatus.CREATED)
  async createLab(@Body() body: any) {
    return this.proxyService.proxy('lab', 'POST', '/labs', body);
  }

  @Get('v1/labs')
  async getLabs(@Query('city') city?: string) {
    const query = city ? `?city=${city}` : '';
    return this.proxyService.proxy('lab', 'GET', `/labs${query}`);
  }

  @Get('v1/labs/:id')
  async getLab(@Param('id') id: string) {
    return this.proxyService.proxy('lab', 'GET', `/labs/${id}`);
  }

  @Get('v1/labs/:id/tests')
  async getLabTests(@Param('id') id: string) {
    return this.proxyService.proxy('lab', 'GET', `/labs/${id}/tests`);
  }

  @Post('v1/labs/:id/book')
  @HttpCode(HttpStatus.CREATED)
  async bookLabTest(@Param('id') id: string, @Body() body: any) {
    return this.proxyService.proxy('lab', 'POST', `/labs/${id}/book`, body);
  }

  @Get('v1/labs/:id/results/:testId')
  async getLabResults(@Param('id') id: string, @Param('testId') testId: string) {
    return this.proxyService.proxy('lab', 'GET', `/labs/${id}/results/${testId}`);
  }

  // ============================================================
  // BLOOD BANK SERVICE
  // ============================================================

  @Get('v1/blood-bank/inventory')
  async getBloodInventory() {
    return this.proxyService.proxy('bloodBank', 'GET', '/blood-bank/inventory');
  }

  @Get('v1/blood-bank/inventory/:bloodType')
  async getBloodTypeInventory(@Param('bloodType') bloodType: string) {
    return this.proxyService.proxy('bloodBank', 'GET', `/blood-bank/inventory/${bloodType}`);
  }

  @Post('v1/blood-bank/donors')
  @HttpCode(HttpStatus.CREATED)
  async registerDonor(@Body() body: any) {
    return this.proxyService.proxy('bloodBank', 'POST', '/blood-bank/donors', body);
  }

  @Get('v1/blood-bank/donors')
  async getDonors(@Query('bloodType') bloodType?: string) {
    const query = bloodType ? `?bloodType=${bloodType}` : '';
    return this.proxyService.proxy('bloodBank', 'GET', `/blood-bank/donors${query}`);
  }

  @Post('v1/blood-bank/requests')
  @HttpCode(HttpStatus.CREATED)
  async createBloodRequest(@Body() body: any) {
    return this.proxyService.proxy('bloodBank', 'POST', '/blood-bank/requests', body);
  }

  // ============================================================
  // ORGAN DONOR SERVICE
  // ============================================================

  @Post('v1/organ-donors')
  @HttpCode(HttpStatus.CREATED)
  async registerOrganDonor(@Body() body: any) {
    return this.proxyService.proxy('organDonor', 'POST', '/organ-donors', body);
  }

  @Get('v1/organ-donors')
  async getOrganDonors() {
    return this.proxyService.proxy('organDonor', 'GET', '/organ-donors');
  }

  @Get('v1/organ-donors/:id')
  async getOrganDonor(@Param('id') id: string) {
    return this.proxyService.proxy('organDonor', 'GET', `/organ-donors/${id}`);
  }

  @Get('v1/organ-donors/search')
  async searchOrganDonors(@Query('organType') organType: string, @Query('bloodType') bloodType?: string) {
    const query = new URLSearchParams();
    if (organType) query.append('organType', organType);
    if (bloodType) query.append('bloodType', bloodType);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return this.proxyService.proxy('organDonor', 'GET', `/organ-donors/search${queryString}`);
  }

  @Get('v1/organ-donors/waitlist')
  async getWaitlist() {
    return this.proxyService.proxy('organDonor', 'GET', '/organ-donors/waitlist');
  }

  // ============================================================
  // INSURANCE SERVICE
  // ============================================================

  @Get('v1/insurance/plans')
  async getInsurancePlans(@Query('type') type?: string) {
    const query = type ? `?type=${type}` : '';
    return this.proxyService.proxy('insurance', 'GET', `/insurance/plans${query}`);
  }

  @Get('v1/insurance/plans/:id')
  async getInsurancePlan(@Param('id') id: string) {
    return this.proxyService.proxy('insurance', 'GET', `/insurance/plans/${id}`);
  }

  @Post('v1/insurance/enroll')
  @HttpCode(HttpStatus.CREATED)
  async enrollInsurance(@Body() body: any) {
    return this.proxyService.proxy('insurance', 'POST', '/insurance/enroll', body);
  }

  @Get('v1/insurance/policies')
  async getPolicies(@Headers('authorization') auth: string) {
    return this.proxyService.proxy('insurance', 'GET', '/insurance/policies', {}, auth);
  }

  @Get('v1/insurance/policies/:id')
  async getPolicy(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.proxyService.proxy('insurance', 'GET', `/insurance/policies/${id}`, {}, auth);
  }

  @Post('v1/insurance/claims')
  @HttpCode(HttpStatus.CREATED)
  async createClaim(@Body() body: any, @Headers('authorization') auth: string) {
    return this.proxyService.proxy('insurance', 'POST', '/insurance/claims', body, auth);
  }

  @Get('v1/insurance/claims')
  async getClaims(@Headers('authorization') auth: string) {
    return this.proxyService.proxy('insurance', 'GET', '/insurance/claims', {}, auth);
  }

  // ============================================================
  // EMERGENCY SERVICE
  // ============================================================

  @Post('v1/emergency/alerts')
  @HttpCode(HttpStatus.CREATED)
  async createEmergencyAlert(@Body() body: any) {
    return this.proxyService.proxy('emergency', 'POST', '/emergency/alerts', body);
  }

  @Get('v1/emergency/alerts')
  async getEmergencyAlerts(@Query('status') status?: string) {
    const query = status ? `?status=${status}` : '';
    return this.proxyService.proxy('emergency', 'GET', `/emergency/alerts${query}`);
  }

  @Get('v1/emergency/alerts/:id')
  async getEmergencyAlert(@Param('id') id: string) {
    return this.proxyService.proxy('emergency', 'GET', `/emergency/alerts/${id}`);
  }

  @Get('v1/emergency/ambulances')
  async getAmbulances(@Query('city') city?: string) {
    const query = city ? `?city=${city}` : '';
    return this.proxyService.proxy('emergency', 'GET', `/emergency/ambulances${query}`);
  }

  @Get('v1/emergency/hospitals/emergency')
  async getEmergencyHospitals(@Query('city') city?: string) {
    const query = city ? `?city=${city}` : '';
    return this.proxyService.proxy('emergency', 'GET', `/emergency/hospitals/emergency${query}`);
  }

  // ============================================================
  // AI SERVICE
  // ============================================================

  @Post('v1/ai/symptom-check')
  @HttpCode(HttpStatus.OK)
  async checkSymptoms(@Body() body: any) {
    return this.proxyService.proxy('ai', 'POST', '/ai/symptom-check', body);
  }

  @Post('v1/ai/drug-interaction')
  @HttpCode(HttpStatus.OK)
  async checkDrugInteraction(@Body() body: any) {
    return this.proxyService.proxy('ai', 'POST', '/ai/drug-interaction', body);
  }

  @Post('v1/ai/health-score')
  @HttpCode(HttpStatus.OK)
  async calculateHealthScore(@Body() body: any) {
    return this.proxyService.proxy('ai', 'POST', '/ai/health-score', body);
  }

  @Get('v1/ai/analysis/:id')
  async getAnalysis(@Param('id') id: string) {
    return this.proxyService.proxy('ai', 'GET', `/ai/analysis/${id}`);
  }

  // ============================================================
  // NOTIFICATION SERVICE
  // ============================================================

  @Post('v1/notifications/send')
  @HttpCode(HttpStatus.CREATED)
  async sendNotification(@Body() body: any) {
    return this.proxyService.proxy('notification', 'POST', '/notifications/send', body);
  }

  @Get('v1/notifications')
  async getNotifications(@Headers('authorization') auth: string) {
    return this.proxyService.proxy('notification', 'GET', '/notifications', {}, auth);
  }

  @Get('v1/notifications/:id')
  async getNotification(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.proxyService.proxy('notification', 'GET', `/notifications/${id}`, {}, auth);
  }

  @Put('v1/notifications/:id/read')
  async markAsRead(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.proxyService.proxy('notification', 'PUT', `/notifications/${id}/read`, {}, auth);
  }

  @Delete('v1/notifications/:id')
  async deleteNotification(@Param('id') id: string, @Headers('authorization') auth: string) {
    return this.proxyService.proxy('notification', 'DELETE', `/notifications/${id}`, {}, auth);
  }
}
