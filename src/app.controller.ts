import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { RemateJudicialService } from './remates.service';
import { ExpedienteRemateDto } from './expediente.remaju.entity';

@Controller()
export class AppController {
  constructor(private readonly remateService: RemateJudicialService) { }

  @Post('registrar-remate-judicial')
  async upsertRemate(@Body() dto: ExpedienteRemateDto) {
    return await this.remateService.registrarExpediente(dto);
  }

  @Get('hola')
  async obtenerRematesJudicial() {
    return "hola mundo v1.0";
  }

}
