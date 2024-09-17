// E:\crud-api-biblioteca-nest\src\v1\health\health.controller.ts

import { Controller, Get } from '@nestjs/common';
import { HealthService } from '@health/health.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  checkHealth(): string {
    return this.healthService.getHealthStatus();
  }
}
