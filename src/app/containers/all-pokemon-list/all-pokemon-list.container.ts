import { Component, inject, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';
import { PokemonListResponse } from 'types/pokemon-list-response.type';
import { SimplePokemon } from 'types/simple-pokemon.type';
import { PokemonListComponent } from '../../components/pokemon-list/pokemon-list.component';
@Component({
    selector: 'app-all-pokemon-list',
    imports: [PokemonListComponent],
    template: `
        <app-pokemon-list
            [pokemonList]="$allPokemon()"
            [isLoading]="pokemonListQuery.isFetchingNextPage()"
            [hasNextPage]="!!pokemonListQuery.hasNextPage()"
            (loadMore)="loadNextPage()"
        />
    `,
})
export class AllPokemonListContainer {
    private readonly httpClient = inject(HttpClient);
    private readonly pageSize = 20;

    $allPokemon = signal<SimplePokemon[]>([]);

    readonly pokemonListQuery = injectInfiniteQuery(() => ({
        queryKey: ['pokemon-list'],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await firstValueFrom(
                this.httpClient.get<PokemonListResponse>(`/api/v2/pokemon?offset=${pageParam}&limit=${this.pageSize}`),
            );

            this.$allPokemon.update((currentPokemons) => [...currentPokemons, ...response.results]);
            return response;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
            if (!lastPage.next) return undefined;

            const match = lastPage.next.match(/offset=(\d+)/);
            return match ? parseInt(match[1]) : undefined;
        },
    }));

    loadNextPage() {
        if (this.pokemonListQuery.hasNextPage()) {
            this.pokemonListQuery.fetchNextPage();
        }
    }
}

// TODO: replace this with a real API call
// TODO: implement "fetch next page" so we can get more than 20 pokemons
// const hardcodedResponse = {
//     count: 1302,
//     next: 'https://pokeapi.co/api/v2/pokemon?offset=20&limit=20',
//     previous: null,
//     results: [
//         {
//             name: 'bulbasaur',
//             url: 'https://pokeapi.co/api/v2/pokemon/1/',
//         },
//         {
//             name: 'ivysaur',
//             url: 'https://pokeapi.co/api/v2/pokemon/2/',
//         },
//         {
//             name: 'venusaur',
//             url: 'https://pokeapi.co/api/v2/pokemon/3/',
//         },
//         {
//             name: 'charmander',
//             url: 'https://pokeapi.co/api/v2/pokemon/4/',
//         },
//         {
//             name: 'charmeleon',
//             url: 'https://pokeapi.co/api/v2/pokemon/5/',
//         },
//         {
//             name: 'charizard',
//             url: 'https://pokeapi.co/api/v2/pokemon/6/',
//         },
//         {
//             name: 'squirtle',
//             url: 'https://pokeapi.co/api/v2/pokemon/7/',
//         },
//         {
//             name: 'wartortle',
//             url: 'https://pokeapi.co/api/v2/pokemon/8/',
//         },
//         {
//             name: 'blastoise',
//             url: 'https://pokeapi.co/api/v2/pokemon/9/',
//         },
//         {
//             name: 'caterpie',
//             url: 'https://pokeapi.co/api/v2/pokemon/10/',
//         },
//         {
//             name: 'metapod',
//             url: 'https://pokeapi.co/api/v2/pokemon/11/',
//         },
//         {
//             name: 'butterfree',
//             url: 'https://pokeapi.co/api/v2/pokemon/12/',
//         },
//         {
//             name: 'weedle',
//             url: 'https://pokeapi.co/api/v2/pokemon/13/',
//         },
//         {
//             name: 'kakuna',
//             url: 'https://pokeapi.co/api/v2/pokemon/14/',
//         },
//         {
//             name: 'beedrill',
//             url: 'https://pokeapi.co/api/v2/pokemon/15/',
//         },
//         {
//             name: 'pidgey',
//             url: 'https://pokeapi.co/api/v2/pokemon/16/',
//         },
//         {
//             name: 'pidgeotto',
//             url: 'https://pokeapi.co/api/v2/pokemon/17/',
//         },
//         {
//             name: 'pidgeot',
//             url: 'https://pokeapi.co/api/v2/pokemon/18/',
//         },
//         {
//             name: 'rattata',
//             url: 'https://pokeapi.co/api/v2/pokemon/19/',
//         },
//         {
//             name: 'raticate',
//             url: 'https://pokeapi.co/api/v2/pokemon/20/',
//         },
//     ],
// };
