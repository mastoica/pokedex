import { Injectable } from '@angular/core';
import { Pokedex } from 'pokeapi-js-wrapper';
import { Observable, from } from 'rxjs';
import { PokemonListResponse } from 'types/pokemon-list-response.type';
import { Pokemon } from 'types/pokemon.type';

@Injectable({
    providedIn: 'root',
})
export class PokemonApiService {
    private pokeApi: any;

    constructor() {
        this.pokeApi = new Pokedex({
            cache: true,
            cacheImages: true,
            timeout: 5000,
        });
    }

    getPokemonList(offset: number = 0, limit: number = 20): Observable<PokemonListResponse> {
        return from(this.pokeApi.getPokemonsList({ offset, limit }) as Observable<PokemonListResponse>);
    }

    getPokemonByName(nameOrId: string | number): Observable<Pokemon> {
        return from(this.pokeApi.getPokemonByName(nameOrId) as Observable<Pokemon>);
    }

    getPokemonSpecies(nameOrId: string | number): Observable<any> {
        return from(this.pokeApi.getPokemonSpeciesByName(nameOrId));
    }

    getEvolutionChain(id: number): Observable<any> {
        return from(this.pokeApi.getEvolutionChainById(id));
    }
}
