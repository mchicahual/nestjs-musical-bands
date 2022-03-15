import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class TrackRequestDTO {
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly nombre_banda: string;

    @ApiProperty()
    @IsNumber()
    readonly cancion_id: number;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly usuario: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly ranking: string;
}