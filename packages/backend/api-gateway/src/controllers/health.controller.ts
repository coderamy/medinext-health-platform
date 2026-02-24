import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

interface ServiceStatus {
  status: string;
  responseTime?: string;
  error?: string;
}

@Controller('health')
export class HealthController {
  private readonly services = [
    { name: 'auth', url: 'http://localhost:3001' },
    { name: 'patient', url: 'http://localhost:3004' },
    { name: 'provider', url: 'http://localhost:3005' },
    { name: 'hospital', url: 'http://localhost:3006' },
    { name: 'pharmacy', url: 'http://localhost:3007' },
    { name: 'lab', url: 'http://localhost:3008' },
    { name: 'appointment', url: 'http://localhost:3009' },
    { name: 'blood-bank', url: 'http://localhost:3010' },
    { name: 'organ-donor', url: 'http://localhost:3011' },
    { name: 'insurance', url: 'http://localhost:3012' },
    { name: 'emergency', url: 'http://localhost:3013' },
    { name: 'ai', url: 'http://localhost:3014' },
    { name: 'notification', url: 'http://localhost:3015' },
  ];

  @Get()
  async check(@Res() res: Response) {
    const serviceStatuses: Record<string, ServiceStatus> = {};
    const startTime = Date.now();

    // Check all services in parallel
    const checks = this.services.map(async (service) => {
      const serviceStartTime = Date.now();
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${service.url}/health`, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        const responseTime = Date.now() - serviceStartTime;

        serviceStatuses[service.name] = {
          status: response.ok ? 'up' : 'down',
          responseTime: `${responseTime}ms`,
        };
      } catch (error) {
        const responseTime = Date.now() - serviceStartTime;
        serviceStatuses[service.name] = {
          status: 'down',
          responseTime: `${responseTime}ms`,
          error: error.message || 'Service unreachable',
        };
      }
    });

    await Promise.all(checks);

    const totalResponseTime = Date.now() - startTime;
    const healthyServices = Object.values(serviceStatuses).filter(
      (s) => s.status === 'up',
    ).length;
    const totalServices = this.services.length;

    const overallStatus =
      healthyServices === totalServices ? 'healthy' : healthyServices > 0 ? 'degraded' : 'down';

    return res.status(HttpStatus.OK).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      totalResponseTime: `${totalResponseTime}ms`,
      summary: {
        total: totalServices,
        healthy: healthyServices,
        unhealthy: totalServices - healthyServices,
      },
      services: serviceStatuses,
    });
  }

  @Get('simple')
  simpleCheck() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      message: 'API Gateway is running. Use /health for detailed status.',
    };
  }
}
