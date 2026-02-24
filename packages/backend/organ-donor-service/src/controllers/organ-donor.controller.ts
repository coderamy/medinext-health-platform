import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { OrganDonorService } from '../services/organ-donor.service';
import { CreateDonorDto, UpdateConsentDto, CreateRecipientDto, ProposeTransplantDto } from '../dto/organ-donor.dto';

@Controller('organ-donor')
export class OrganDonorController {
  constructor(private readonly organDonorService: OrganDonorService) {}

  // Donor Endpoints
  @Post('donors')
  async registerDonor(@Body() createDonorDto: CreateDonorDto) {
    return this.organDonorService.registerDonor(createDonorDto);
  }

  @Put('donors/:id/consent')
  async updateDonorConsent(
    @Param('id') id: string,
    @Body() consentData: UpdateConsentDto,
  ) {
    return this.organDonorService.updateDonorConsent(id, consentData);
  }

  @Get('donors/:id')
  async getDonor(@Param('id') id: string) {
    return this.organDonorService.getDonorById(id);
  }

  @Get('donors')
  async getActiveDonors() {
    return this.organDonorService.getActiveDonors();
  }

  @Put('donors/:id/revoke')
  async revokeDonor(@Param('id') id: string, @Body('reason') reason: string) {
    return this.organDonorService.revokeDonor(id, reason);
  }

  // Recipient Endpoints
  @Post('recipients')
  async addRecipient(@Body() createRecipientDto: CreateRecipientDto) {
    return this.organDonorService.addRecipient(createRecipientDto);
  }

  @Get('recipients/:id')
  async getRecipient(@Param('id') id: string) {
    return this.organDonorService.getRecipientById(id);
  }

  @Get('recipients')
  async getWaitingList(@Query('organ') organ?: string) {
    return this.organDonorService.getWaitingList(organ);
  }

  @Put('recipients/:id/status')
  async updateRecipientStatus(
    @Param('id') id: string,
    @Body('status') status: string,
  ) {
    return this.organDonorService.updateRecipientStatus(id, status as any);
  }

  // Matching Endpoints
  @Get('donors/:id/matches')
  async findMatches(@Param('id') donorId: string) {
    return this.organDonorService.findMatches(donorId);
  }

  // Transplant Endpoints
  @Post('transplants')
  async proposeTransplant(@Body() proposeTransplantDto: ProposeTransplantDto) {
    return this.organDonorService.proposeTransplant(
      proposeTransplantDto.donorId,
      proposeTransplantDto.recipientId,
      proposeTransplantDto.organ,
    );
  }

  @Put('transplants/:id/approve')
  async approveTransplant(@Param('id') id: string) {
    return this.organDonorService.approveTransplant(id);
  }

  @Put('transplants/:id/complete')
  async completeTransplant(
    @Param('id') id: string,
    @Body() data: { outcome: string; success: boolean },
  ) {
    return this.organDonorService.completeTransplant(id, data.outcome, data.success);
  }

  @Get('transplants/:id')
  async getTransplant(@Param('id') id: string) {
    return this.organDonorService.getTransplantById(id);
  }

  // Statistics
  @Get('statistics')
  async getStatistics() {
    return this.organDonorService.getStatistics();
  }
}
