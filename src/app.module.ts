import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SheetOdmModule } from '@dantesito/spreadsheet-odm';
import { AdelantoEntity, ObreroEntity } from './entities';
import { configLoader } from '@configloader';
import { envValidationSchema } from '@env-schema';
import { CronogramaEntity, InmuebleEntity, RemateEntity } from './expediente.remaju.entity';
import { RemateJudicialService } from './remates.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configLoader],                  // Carga tus variables personalizadas
      validationSchema: envValidationSchema, // 🛡️ Bloquea el arranque si falta algo del .env
      validationOptions: {
        allowUnknown: true, // Permite que existan otras variables en el .env sin que Joi lance error
        abortEarly: false,  // Muestra TODOS los errores a la vez, no solo el primero
      },
    }),
    SheetOdmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      // 🚀 Extraemos las configuraciones ya armadas y validadas desde el configLoader
      useFactory: (config: ConfigService) => ({
        auth: config.get('auth')!,
        odm: config.get('odm')!,
      }),
    }),

    SheetOdmModule.forFeature([
      ObreroEntity,
      AdelantoEntity,
      RemateEntity, InmuebleEntity, CronogramaEntity]),
  ],
  controllers: [AppController],
  providers: [AppService, RemateJudicialService],
})
export class AppModule { }
