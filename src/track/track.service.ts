import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IMusicalBand } from 'src/common/interfaces/musical-band.interface';
import { setupCache } from 'axios-cache-adapter';
import { Cancion, Precio, TrackResponseDTO } from './dto/track-response.dto';
import { TrackRequestDTO } from './dto/track-request.dto';
import * as fs from 'fs';

@Injectable()
export class TrackService {

    private readonly logger = new Logger(TrackService.name);
    private cache = setupCache({
        maxAge: process.env.CACHE_EXPIRATION ? Number(process.env.CACHE_EXPIRATION) : 3600,
        limit: process.env.CACHE_ITEMS ? Number(process.env.CACHE_ITEMS) : 25
    });
    private jsonFile = "./src/temp/data.json";

    constructor(private readonly httpService: HttpService) { }

    saveTempData(trackRequestDTO: TrackRequestDTO) {
        fs.writeFileSync(this.jsonFile, JSON.stringify(trackRequestDTO));
    }

    readTempData() {
        if (!fs.existsSync(this.jsonFile)) {
            return [];
        }
        const data = fs.readFileSync(this.jsonFile, { encoding: "utf-8" });
        return data ? JSON.parse(data) : [];
    }
    mapToITrack(artistName: string, musicalBand: IMusicalBand): TrackResponseDTO {
        const trackResponseDTO = new TrackResponseDTO();
        const filter = musicalBand.results.filter((result) => result.artistName.toLowerCase() === artistName.toLowerCase()).slice(0, process.env.FIRST_REGISTER_LENGTH ? Number(process.env.FIRST_REGISTER_LENGTH) : 25);
        const albumes = [... new Set(filter.map(data => data.collectionName))]
        const canciones: Cancion[] = filter.flatMap((c) => {
            const cancion = new Cancion();
            cancion.cancion_id = c.trackId;
            cancion.nombre_album = c.collectionName;
            cancion.nombre_tema = c.trackName;
            cancion.preview_url = c.previewUrl;
            cancion.fecha_lanzamiento = c.releaseDate;
            const precio = new Precio();
            precio.moneda = c.currency;
            precio.valor = c.trackPrice;
            cancion.precio = precio;
            return cancion;
        });
        trackResponseDTO.total_albumes = albumes.length;
        trackResponseDTO.total_canciones = canciones.length;
        trackResponseDTO.albumes = albumes;
        trackResponseDTO.canciones = canciones;
        return trackResponseDTO;
    }

    async getMusicalBands(name: string): Promise<IMusicalBand> {
        const config = {
            adapter: this.cache.adapter,
        };
        try {
            const { data } = await firstValueFrom(this.httpService.get(`${process.env.BASE_URL_ITUNES}/search?term=${name}`, config));
            return data;
        } catch (error) {
            throw new BadRequestException("Not Found Artist Name");
        }
        
    }

    async searchTracks(name: string): Promise<TrackResponseDTO> {
        this.logger.log(`without cache searchTracks: ${name}`);
        const musicalBand: IMusicalBand = await this.getMusicalBands(name);
        return this.mapToITrack(name, musicalBand);
    }

    async favoritTrack(trackRequestDTO: TrackRequestDTO): Promise<TrackRequestDTO> {
        const currentData = this.readTempData();
        const index = currentData.find(data => data.cancion_id === trackRequestDTO.cancion_id);
        if (index) {
            throw new BadRequestException("Payload Already Exists");
        }
        const musicalBand: IMusicalBand = await this.getMusicalBands(trackRequestDTO.nombre_banda);
        const indexValid = musicalBand.results.find(data => data.trackId === trackRequestDTO.cancion_id && data.artistName.toLowerCase() === trackRequestDTO.nombre_banda.toLowerCase());
        if (!indexValid) {
            throw new BadRequestException("Invalid Payload Parameters");
        }
        currentData.push(trackRequestDTO);
        this.saveTempData(currentData);
        return currentData;
    }
}
