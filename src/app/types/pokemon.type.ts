import { PokemonSprite } from './pokemon-sprite.type';
import { PokemonType } from './pokemon-type.type';

// TODO: if we use https://github.com/Gabb-c/pokenode-ts should we use the types from there instead?
export interface Pokemon {
    id: string;
    name: string;
    height: number;
    weight: number;
    types: PokemonType[];
    sprites: PokemonSprite;
}
