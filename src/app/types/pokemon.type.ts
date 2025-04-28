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
    stats: Stat[];
    moves: Move[];
    abilities: Ability[];
}

export interface Stat {
    base_stat: number;
    effort: number;
    stat: {
        name: string;
        url: string;
    };
}

export interface Move {
    move: {
        name: string;
        url: string;
    };
    version_group_details: Array<{
        level_learned_at: number;
        move_learn_method: {
            name: string;
            url: string;
        };
        version_group: {
            name: string;
            url: string;
        };
    }>;
}

export interface Ability {
    ability: {
        name: string;
        url: string;
    };
    is_hidden: boolean;
    slot: number;
}
