import { animate, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
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
        <div
            class="w-full bg-black text-white h-60 p-2 rounded-md shadow-inner relative"
            [@fadeAnimation]="$pokemonId()"
        >
            @if (currentPokemonInfo.data() || cachedPokemon()) {
                <app-pokemon-info
                    [pokemonInfo]="currentPokemonInfo.data() || cachedPokemon()"
                    [class.opacity-40]="currentPokemonInfo.isLoading()"
                />
            }

            @if (currentPokemonInfo.isLoading()) {
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-md">
                    <div class="pokemon-loader"></div>
                </div>
            }
        </div>

        <div class="tabs-container relative" [@fadeAnimation]="$pokemonId()">
            @if (currentPokemonInfo.data() || cachedPokemon()) {
                <app-pokemon-tabs
                    [pokemonData]="currentPokemonInfo.data() || cachedPokemon()"
                    [class.opacity-40]="currentPokemonInfo.isLoading()"
                />
            } @else {
                <div class="flex flex-row *:flex-auto gap-2">
                    <button class="bg-cyan-300 p-2 rounded-md">Stats</button>
                    <button class="bg-cyan-300 p-2 rounded-md">Moves</button>
                    <button class="bg-cyan-300 p-2 rounded-md">Abilities</button>
                </div>
                <div class="grow bg-gray-700 p-4 rounded-md text-white">Loading Pokémon data...</div>
            }

            @if (currentPokemonInfo.isLoading() && cachedPokemon()) {
                <div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-md">
                    <div class="pokemon-loader sm"></div>
                </div>
            }
        </div>
    `,
    animations: [
        trigger('fadeAnimation', [
            transition('* => *', [style({ opacity: 0.7 }), animate('400ms ease-out', style({ opacity: 1 }))]),
        ]),
    ],
    styles: [
        `
            .pokemon-loader {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(to bottom, rgb(254, 0, 0) 50%, rgb(255, 255, 255) 50%);
                position: relative;
                animation: spin 1s linear infinite;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
            }

            .pokemon-loader::before {
                content: '';
                position: absolute;
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: white;
                border: 2px solid #000;
                z-index: 1;
            }

            .pokemon-loader::after {
                content: '';
                position: absolute;
                width: 48px;
                height: 48px;
                border-radius: 50%;
                background: transparent;
                border: 2px solid #000;
                z-index: 0;
            }

            .pokemon-loader.sm {
                width: 40px;
                height: 40px;
            }

            .pokemon-loader.sm::before {
                width: 6px;
                height: 6px;
            }

            .pokemon-loader.sm::after {
                width: 38px;
                height: 38px;
            }

            .tabs-container {
                position: relative;
                flex-grow: 1;
            }

            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }
        `,
    ],
})
export class PokemonDetailContainer {
    private readonly httpClient = inject(HttpClient);
    private readonly route = inject(ActivatedRoute);
    readonly $pokemonId = toSignal(this.route.params.pipe(map((params) => params['pokemonId'] || 'bulbasaur')));

    readonly cachedPokemon = signal<Pokemon | null>(null);

    readonly currentPokemonInfo = injectQuery(() => ({
        queryKey: ['pokemon', this.$pokemonId()],
        queryFn: () => firstValueFrom(this.httpClient.get<Pokemon>(`/api/v2/pokemon/${this.$pokemonId()}`)),
        onSuccess: (data) => {
            this.cachedPokemon.set(data);
        },
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
    }));

    constructor() {
        injectTwHostClass(() => 'flex flex-col gap-4 p-5 pt-20');
    }
}
