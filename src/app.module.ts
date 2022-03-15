import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackModule } from './track/track.module';

@Module({
  imports: [TrackModule, CacheModule.register({
    isGlobal: true,
    ttl: process.env.CACHE_EXPIRATION ? Number(process.env.CACHE_EXPIRATION) : 3600, // seconds 3600 miliseconds
    max: process.env.CACHE_ITEMS ? Number(process.env.CACHE_ITEMS) : 25 // maximum number of items in cache
  }), ConfigModule.forRoot({
    envFilePath: ['.env.development'],
  })],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
