import { InjectModel, INTERNAL_NEW, INTERNAL_REPO } from '@dantesito/spreadsheet-odm';
import { Injectable, Logger } from '@nestjs/common';
import { AdelantoEntity, CreateAdelantoDto1 } from './entities';
import type { Model } from '@dantesito/spreadsheet-odm';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @InjectModel(AdelantoEntity)
    private readonly adelantoModel: Model<AdelantoEntity>
  ) { }
  getHello(): string {
    return 'Hello World!';
  }
  async create(payload: CreateAdelantoDto1) {
    this.logger.log(`Creando adelanto: ${payload}`);
    // Usamos el método 'save' del modelo
    return this.adelantoModel.save(payload);
  }

}
