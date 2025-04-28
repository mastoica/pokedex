import { SimplePokemon } from './simple-pokemon.type';

export interface PokemonListResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: SimplePokemon[];
}
