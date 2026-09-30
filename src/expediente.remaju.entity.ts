import {
    Table,
    PrimaryKey,
    Column,
    SubCollection
} from '@dantesito/spreadsheet-odm';

import {
    IsString,
    IsOptional,
    IsObject,
    IsArray,
    ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

// ==========================================
// DTOS
// ==========================================

export class FaseCronogramaDto {
    @IsString()
    @IsOptional()
    fechaInicio: string;

    @IsString()
    @IsOptional()
    fechaFin: string;
}

export class CronogramaDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    idRemate?: string;

    // Fase 1: Publicación
    @IsString()
    @IsOptional()
    publicacionInicio: string;

    @IsString()
    @IsOptional()
    publicacionFin: string;

    // Fase 2: Ofertas
    @IsString()
    @IsOptional()
    ofertasInicio: string;

    @IsString()
    @IsOptional()
    ofertasFin: string;
}

export class InmueblesDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    idRemate?: string;

    @IsString()
    @IsOptional()
    departamento: string;

    @IsString()
    @IsOptional()
    provincia: string;

    @IsString()
    @IsOptional()
    distrito: string;

    @IsString()
    @IsOptional()
    direccion: string; // <-- AÑADIDO

    @IsString()
    @IsOptional()
    enlaceMapa: string; // <-- AÑADIDO (generado en Python)

    @IsString()
    @IsOptional()
    partidaRegistral: string;

    @IsString()
    @IsOptional()
    tipoInmueble: string;

    @IsString()
    @IsOptional()
    cargaYGravamen: string;

    @IsString()
    @IsOptional()
    porcentajeRematar: string;
}

export class RemateDto {
    @IsString()
    @IsOptional()
    id?: string;

    @IsString()
    @IsOptional()
    expediente: string;

    @IsString()
    @IsOptional()
    distritoJudicial: string; // <-- AÑADIDO

    @IsString()
    @IsOptional()
    instancia: string; // <-- AÑADIDO

    @IsString()
    @IsOptional()
    convocatoria: string;

    @IsString()
    @IsOptional()
    tasacion: string;

    @IsString()
    @IsOptional()
    precioBase: string;

    @IsString()
    @IsOptional()
    incrementoEntreOfertas: string;

    @IsString()
    @IsOptional()
    arancel: string;

    @IsString()
    @IsOptional()
    oblaje: string;

    @IsString()
    @IsOptional()
    descripcion: string;

    @IsString()
    @IsOptional()
    materia: string;

    @IsString()
    @IsOptional()
    resolucion: string;

    @IsString()
    @IsOptional()
    fechaResolucion: string;

    @IsString()
    @IsOptional()
    tipoCambio: string; // <-- AÑADIDO

    @IsString()
    @IsOptional()
    archivoUrl: string;
}

export class ExpedienteRemateDto {
    @IsObject()
    @ValidateNested()
    @Type(() => RemateDto)
    remate: RemateDto;

    // Cambiado a Array para coincidir con la relación One-To-Many de la entidad
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => InmueblesDto)
    inmuebles: InmueblesDto[];

    // Asumimos que es un solo cronograma por remate en el JSON
    @IsObject()
    @ValidateNested()
    @Type(() => CronogramaDto)
    cronograma: CronogramaDto;
}

// ==========================================
// 1. ENTIDAD PRINCIPAL: REMATES
// ==========================================
@Table('REMATES_JUDICIALES', { dto: RemateDto })
export class RemateEntity {
    @PrimaryKey()
    @Column({ name: 'ID_REMATE', generated: 'short-id', index: true })
    id: string;

    @Column({ name: 'EXPEDIENTE', required: true, index: true })
    expediente: string;

    @Column({ name: 'DISTRITO_JUDICIAL', type: 'string' })
    distritoJudicial: string;

    @Column({ name: 'INSTANCIA', type: 'string' })
    instancia: string;

    @Column({ name: 'CONVOCATORIA', type: 'string' })
    convocatoria: string;

    @Column({ name: 'TASACION', type: 'string' })
    tasacion: string;

    @Column({ name: 'PRECIO_BASE', type: 'string' })
    precioBase: string;

    @Column({ name: 'INCREMENTO_OFERTAS', type: 'string' })
    incrementoEntreOfertas: string;

    @Column({ name: 'ARANCEL', type: 'string' })
    arancel: string;

    @Column({ name: 'OBLAJE', type: 'string' })
    oblaje: string;

    @Column({ name: 'DESCRIPCION', type: 'string' })
    descripcion: string;

    @Column({ name: 'MATERIA', type: 'string' })
    materia: string;

    @Column({ name: 'RESOLUCION', type: 'string' })
    resolucion: string;

    @Column({ name: 'FECHA_RESOLUCION', type: 'string' })
    fechaResolucion: string;

    @Column({ name: 'TIPO_CAMBIO', type: 'string' })
    tipoCambio: string;

    @Column({ name: 'ARCHIVO_URL', type: 'string' })
    archivoUrl: string;

    @SubCollection(() => InmuebleEntity, { joinColumn: 'idRemate' })
    inmuebles: InmuebleEntity[];

    @SubCollection(() => CronogramaEntity, { joinColumn: 'idRemate' })
    cronograma: CronogramaEntity[];
}

// ==========================================
// 2. ENTIDAD SECUNDARIA: INMUEBLES
// ==========================================
@Table('INMUEBLES_REMATES', { dto: InmueblesDto })
export class InmuebleEntity {
    @PrimaryKey()
    @Column({ name: 'ID_INMUEBLE', generated: 'short-id', index: true })
    id: string;

    @Column({ name: 'ID_REMATE', required: true, index: true })
    idRemate: string;

    @Column({ name: 'DEPARTAMENTO', type: 'string' })
    departamento: string;

    @Column({ name: 'PROVINCIA', type: 'string' })
    provincia: string;

    @Column({ name: 'DISTRITO', type: 'string' })
    distrito: string;

    @Column({ name: 'DIRECCION', type: 'string' })
    direccion: string;

    @Column({ name: 'ENLACE_MAPA', type: 'string' })
    enlaceMapa: string;

    @Column({ name: 'PARTIDA_REGISTRAL', type: 'string' })
    partidaRegistral: string;

    @Column({ name: 'TIPO_INMUEBLE', type: 'string' })
    tipoInmueble: string;

    @Column({ name: 'CARGA_GRAVAMEN', type: 'string' })
    cargaYGravamen: string;

    @Column({ name: 'PORCENTAJE_REMATAR', type: 'string' })
    porcentajeRematar: string;
}

// ==========================================
// 3. ENTIDAD SECUNDARIA: CRONOGRAMAS
// ==========================================
@Table('CRONOGRAMAS_REMATES', { dto: CronogramaDto })
export class CronogramaEntity {
    @PrimaryKey()
    @Column({ name: 'ID_CRONOGRAMA', generated: 'short-id', index: true })
    id: string;

    @Column({ name: 'ID_REMATE', required: true, index: true })
    idRemate: string;

    // Fase 1: Publicación e Inscripción
    @Column({ name: 'PUB_INSCRIPCION_INICIO', type: 'string' })
    publicacionInicio: string;

    @Column({ name: 'PUB_INSCRIPCION_FIN', type: 'string' })
    publicacionFin: string;

    // Fase 2: Presentación de Ofertas
    @Column({ name: 'PRES_OFERTAS_INICIO', type: 'string' })
    ofertasInicio: string;

    @Column({ name: 'PRES_OFERTAS_FIN', type: 'string' })
    ofertasFin: string;
}   