// remate-judicial.service.ts
import { InjectModel } from '@dantesito/spreadsheet-odm';
import { Injectable, Logger } from '@nestjs/common';
import type { Model } from '@dantesito/spreadsheet-odm';
import { CronogramaEntity, ExpedienteRemateDto, InmuebleEntity, RemateEntity } from './expediente.remaju.entity';

@Injectable()
export class RemateJudicialService {
    private readonly logger = new Logger(RemateJudicialService.name);

    constructor(
        @InjectModel(RemateEntity)
        private readonly remateModel: Model<RemateEntity>,
        @InjectModel(InmuebleEntity)
        private readonly inmuebleModel: Model<InmuebleEntity>,
        @InjectModel(CronogramaEntity)
        private readonly cronogramaModel: Model<CronogramaEntity>,
    ) { }

    async registrarExpediente(dto: ExpedienteRemateDto) {
        this.logger.log(`[ODM:REGISTRAR] Registrando nuevo remate judicial - Expediente: ${dto.remate.expediente}`);

        // 1. Guardar el remate principal y obtener el ID generado
        const nuevoRemate = await this.remateModel.save(dto.remate);
        const remateId = nuevoRemate.id;

        // 2. Registrar los inmuebles asociados (Subcolección 1-N)
        if (dto.inmuebles && dto.inmuebles.length > 0) {
            for (const inmuebleDto of dto.inmuebles) {
                inmuebleDto.idRemate = remateId;
                await this.inmuebleModel.save(inmuebleDto);
            }
            this.logger.log(`[ODM] Se registraron ${dto.inmuebles.length} inmuebles para el remate ID: ${remateId}`);
        }

        // 3. Registrar el cronograma asociado
        if (dto.cronograma) {
            dto.cronograma.idRemate = remateId;
            await this.cronogramaModel.save(dto.cronograma);
            this.logger.log(`[ODM] Cronograma registrado para el remate ID: ${remateId}`);
        }

        return {
            success: true,
            mensaje: 'Remate judicial registrado correctamente',
            idRemate: remateId,
            datos: dto,
        };
    }
}