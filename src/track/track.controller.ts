import { Body, CacheInterceptor, Controller, Get, HttpCode, Post, Query, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { TrackRequestDTO } from './dto/track-request.dto';
import { TrackService } from './track.service';

@ApiTags("tracks")
@Controller('api/v1/track')
@UseInterceptors(CacheInterceptor)
export class TrackController {

    constructor(private readonly trackService : TrackService) {}

    @ApiOperation({summary : "Search Track By Artist Name"})
    @Get("/search_tracks")
    searchTracks(@Query("name") name : string){
        return this.trackService.searchTracks(name);
    }

    @ApiOperation({summary : "Save Favorit Track"})
    @Post("/favoritos")
    //@UsePipes(new ValidationPipe()) //valida objeto de entrada, pero se agrego validacion global
    @HttpCode(200)
    favoritTrack(@Body() track : TrackRequestDTO){
        return this.trackService.favoritTrack(track);
    }
}
