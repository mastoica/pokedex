import { Component, inject, signal } from '@angular/core';

import { injectInfiniteQuery } from '@tanstack/angular-query-experimental';
import { NamedAPIResource } from 'pokenode-ts';
import { firstValueFrom } from 'rxjs';
import { PokemonApiService } from 'services/pokemon-api.service';
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
    private readonly pokemonService = inject(PokemonApiService);
    private readonly pageSize = 20;

    $allPokemon = signal<NamedAPIResource[]>([]);

    readonly pokemonListQuery = injectInfiniteQuery(() => ({
        queryKey: ['pokemon-list'],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await firstValueFrom(this.pokemonService.getPokemonList(pageParam, this.pageSize));

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
