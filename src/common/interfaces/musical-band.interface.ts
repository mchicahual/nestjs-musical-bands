export interface IMusicalBand {
    resultCount: number;
    results:     Result[];
}

export interface Result {
    wrapperType:            WrapperType;
    artistId:               number;
    collectionId:           number;
    artistName:             string;
    collectionName:         string;
    collectionCensoredName: string;
    artistViewUrl:          string;
    collectionViewUrl:      string;
    artworkUrl60:           string;
    artworkUrl100:          string;
    collectionPrice:        number;
    collectionExplicitness: Explicitness;
    trackCount:             number;
    copyright?:             string;
    country:                Country;
    currency:               Currency;
    releaseDate:            Date;
    primaryGenreName:       string;
    previewUrl:             string;
    description?:           string;
    kind?:                  Kind;
    trackId?:               number;
    trackName?:             string;
    trackCensoredName?:     string;
    trackViewUrl?:          string;
    artworkUrl30?:          string;
    trackPrice?:            number;
    trackExplicitness?:     Explicitness;
    discCount?:             number;
    discNumber?:            number;
    trackNumber?:           number;
    trackTimeMillis?:       number;
    isStreamable?:          boolean;
    contentAdvisoryRating?: string;
    collectionArtistId?:    number;
    collectionArtistName?:  string;
}

export enum Explicitness {
    Explicit = "explicit",
    NotExplicit = "notExplicit",
}

export enum Country {
    Usa = "USA",
}

export enum Currency {
    Usd = "USD",
}

export enum Kind {
    Song = "song",
}

export enum WrapperType {
    Audiobook = "audiobook",
    Track = "track",
}
