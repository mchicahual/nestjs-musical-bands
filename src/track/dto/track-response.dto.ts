export class TrackResponseDTO {
    total_albumes: number;
    total_canciones: number;
    albumes: string[];
    canciones: Cancion[];
}

export class Cancion {
    cancion_id: number;
    nombre_album: string;
    nombre_tema: string;
    preview_url: string;
    fecha_lanzamiento: Date;
    precio: Precio;
}

export class Precio {
    valor: number;
    moneda: string;
}