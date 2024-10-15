// E:\crud-api-biblioteca-nest\src\v1\health\health.controller.ts

import { Controller, Get } from '@nestjs/common';
import { HealthService } from '@health/health.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';  

@ApiTags('Health') // Agrupa este controlador bajo la etiqueta 'Health' en Swagger
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener estado de salud del servicio' }) // Descripción del endpoint en Swagger
  checkHealth(): string {
    return this.healthService.getHealthStatus();
  }
}
