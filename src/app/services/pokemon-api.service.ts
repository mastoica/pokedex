import { Injectable } from '@angular/core';
import { Pokedex } from 'pokeapi-js-wrapper';
import { NamedAPIResourceList, Pokemon, PokemonClient } from 'pokenode-ts';
import { Observable, from } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class PokemonApiService {
    private pokeApi: any;
    private pokemonClient = new PokemonClient();

    constructor() {
        this.pokeApi = new Pokedex({
            cache: true,
            cacheImages: true,
            timeout: 5000,
        });
    }

    // getPokemonList(offset: number = 0, limit: number = 20): Observable<PokemonListResponse> {
    //     return from(this.pokeApi.getPokemonsList({ offset, limit }) as Observable<PokemonListResponse>);
    // }
    getPokemonList(offset: number = 0, limit: number = 20): Observable<NamedAPIResourceList> {
        return from(this.pokemonClient.listPokemons(offset, limit));
    }

    // getPokemonByName(nameOrId: string | number): Observable<Pokemon> {
    //     return from(this.pokeApi.getPokemonByName(nameOrId) as Observable<Pokemon>);
    // }
    getPokemonByName(name: string): Observable<Pokemon> {
        return from(this.pokemonClient.getPokemonByName(name));
    }

    // getPokemonSpecies(nameOrId: string | number): Observable<any> {
    //     return from(this.pokeApi.getPokemonSpeciesByName(nameOrId));
    // }
    getPokemonSpecies(name: string): Observable<any> {
        return from(this.pokemonClient.getPokemonSpeciesByName(name));
    }

    getEvolutionChain(id: number): Observable<any> {
        return from(this.pokeApi.getEvolutionChainById(id));
    }
}
