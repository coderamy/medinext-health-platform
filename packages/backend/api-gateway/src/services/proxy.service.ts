import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ProxyService {
  private readonly services = {
    auth: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
    patient: process.env.PATIENT_SERVICE_URL || 'http://localhost:3004',
    provider: process.env.PROVIDER_SERVICE_URL || 'http://localhost:3005',
    hospital: process.env.HOSPITAL_SERVICE_URL || 'http://localhost:3006',
    pharmacy: process.env.PHARMACY_SERVICE_URL || 'http://localhost:3007',
    lab: process.env.LAB_SERVICE_URL || 'http://localhost:3008',
    appointment: process.env.APPOINTMENT_SERVICE_URL || 'http://localhost:3003',
    bloodBank: process.env.BLOOD_BANK_SERVICE_URL || 'http://localhost:3010',
    organDonor: process.env.ORGAN_DONOR_SERVICE_URL || 'http://localhost:3011',
    insurance: process.env.INSURANCE_SERVICE_URL || 'http://localhost:3012',
    emergency: process.env.EMERGENCY_SERVICE_URL || 'http://localhost:3013',
    ai: process.env.AI_SERVICE_URL || 'http://localhost:3014',
    notification: process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3015',
  };

  constructor(private readonly httpService: HttpService) {}

async proxy(serviceName: string, method: string, path: string, body?: any, authToken?: string): Promise<any> {
    const baseUrl = this.services[serviceName];
    if (!baseUrl) {
      throw new Error(`Service ${serviceName} not found`);
    }

    // Strip /api/v1 prefix from path when forwarding to backend services
    // e.g., /api/v1/auth/register -> /auth/register
    const backendPath = path.replace(/^\/api\/v1/, '');

    const url = `${baseUrl}${backendPath}`;
    const headers: any = {
      'Content-Type': 'application/json',
    };

    if (authToken) {
      headers['Authorization'] = authToken;
    }

    try {
      let response;
      switch (method.toUpperCase()) {
        case 'GET':
          response = await this.httpService.axiosRef.get(url, { headers });
          break;
        case 'POST':
          response = await this.httpService.axiosRef.post(url, body, { headers });
          break;
        case 'PUT':
          response = await this.httpService.axiosRef.put(url, body, { headers });
          break;
        case 'DELETE':
          response = await this.httpService.axiosRef.delete(url, { headers });
          break;
        case 'PATCH':
          response = await this.httpService.axiosRef.patch(url, body, { headers });
          break;
        default:
          throw new Error(`Method ${method} not supported`);
      }
      return response.data;
    } catch (error) {
      if (error.response) {
        throw error.response.data;
      } else if (error.request) {
        throw { statusCode: 503, message: 'Service unavailable' };
      } else {
        throw { statusCode: 500, message: error.message };
      }
    }
  }
}
