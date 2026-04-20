export interface Genre {
  id: number;
  name: string;
}

export interface Game {
  id: number;
  name: string;
  genre: string;
  price: number;
  releaseDate: string;
  studio: string;
}
