import { Injectable } from '@nestjs/common';

@Injectable()
export class HealthService {
  getHealthStatus(): string {
    return 'Servicio esta corriendo y funcionando correctamente!';
  }
}