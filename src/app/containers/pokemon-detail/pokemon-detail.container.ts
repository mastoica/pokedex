import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom, map } from 'rxjs';
import { Pokemon } from 'types/pokemon.type';

import { ActivatedRoute } from '@angular/router';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { PokemonInfoComponent } from '../../components/pokemon-info/pokemon-info.component';
import { PokemonTabsComponent } from '../../components/pokemon.tabs/pokemon-tabs.component';

@Component({
    selector: 'app-pokemon-detail',
    imports: [PokemonInfoComponent, PokemonTabsComponent],
    template: `
        <div class="w-full bg-black text-white h-60 p-2 rounded-md shadow-inner">
            @if (currentPokemonInfo.data(); as pokemonInfo) {
                <app-pokemon-info [pokemonInfo]="pokemonInfo" />
            }
        </div>

        @if (currentPokemonInfo.data(); as pokemonInfo) {
            <app-pokemon-tabs [pokemonData]="pokemonInfo" />
        } @else {
            <div class="flex flex-row *:flex-auto gap-2">
                <button class="bg-cyan-300 p-2 rounded-md">Tab 1</button>
                <button class="bg-cyan-300 p-2 rounded-md">Tab 2</button>
                <button class="bg-cyan-300 p-2 rounded-md">Tab 3</button>
            </div>
            <div class="grow bg-gray-200 p-2 rounded-md">Loading...</div>
        }
    `,
})
export class PokemonDetailContainer {
    private readonly httpClient = inject(HttpClient);
    private readonly route = inject(ActivatedRoute);
    private readonly $pokemonId = toSignal(this.route.params.pipe(map((params) => params['pokemonId'] || 'bulbasaur')));

    readonly currentPokemonInfo = injectQuery(() => ({
        queryKey: ['pokemon', this.$pokemonId()],
        queryFn: () =>
            // TODO: use https://github.com/PokeAPI/pokeapi-js-wrapper instead?
            firstValueFrom(this.httpClient.get<Pokemon>(`/api/v2/pokemon/${this.$pokemonId()}`)),
    }));

    constructor() {
        injectTwHostClass(() => 'flex flex-col gap-4 p-5 pt-20');
    }
}
