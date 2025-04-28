import { animate, style, transition, trigger } from '@angular/animations';
import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { firstValueFrom, map } from 'rxjs';

import { ActivatedRoute } from '@angular/router';
import { Pokemon } from 'pokenode-ts';
import { PokemonApiService } from 'services/pokemon-api.service';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';
import { PokemonInfoComponent } from '../../components/pokemon-info/pokemon-info.component';
import { PokemonTabsComponent } from '../../components/pokemon-tabs/pokemon-tabs.component';

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
                <div class="loading-tabs-container">
                    <div class="tab-header-placeholder flex gap-1 mb-2">
                        <div class="tab-button-placeholder flex-1 py-2 px-3 rounded-t-lg"></div>
                        <div class="tab-button-placeholder flex-1 py-2 px-3 rounded-t-lg"></div>
                        <div class="tab-button-placeholder flex-1 py-2 px-3 rounded-t-lg"></div>
                        <div class="tab-button-placeholder flex-1 py-2 px-3 rounded-t-lg"></div>
                    </div>
                    <div class="tab-content-placeholder h-[260px] rounded-b-lg rounded-tr-lg p-4">
                        <div class="h-6 w-32 bg-gray-700 rounded mb-4"></div>
                        <div class="grid grid-cols-2 gap-3">
                            <div class="h-16 bg-gray-700 rounded"></div>
                            <div class="h-16 bg-gray-700 rounded"></div>
                            <div class="h-16 bg-gray-700 rounded"></div>
                            <div class="h-16 bg-gray-700 rounded"></div>
                        </div>
                    </div>
                </div>
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

            .loading-tabs-container {
                display: flex;
                flex-direction: column;
                width: 100%;
            }

            .tab-header-placeholder {
                margin-bottom: 0.5rem;
            }

            .tab-button-placeholder {
                background-color: #2d3748;
                height: 36px;
                border-radius: 0.5rem 0.5rem 0 0;
                opacity: 0.6;
                animation: pulse 1.5s infinite alternate;
            }

            .tab-content-placeholder {
                background-color: #1a202c;
                border: 1px solid #2d3748;
                box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
            }

            .tab-content-placeholder > div {
                opacity: 0.4;
                animation: pulse 1.5s infinite alternate;
            }

            @keyframes pulse {
                0% {
                    opacity: 0.4;
                }
                100% {
                    opacity: 0.7;
                }
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
    private readonly pokemonService = inject(PokemonApiService);
    private readonly route = inject(ActivatedRoute);
    readonly $pokemonId = toSignal(this.route.params.pipe(map((params) => params['pokemonId'] || 'bulbasaur')));

    readonly cachedPokemon = signal<Pokemon | null>(null);

    readonly currentPokemonInfo = injectQuery(() => ({
        queryKey: ['pokemon', this.$pokemonId()],
        queryFn: () => firstValueFrom(this.pokemonService.getPokemonByName(this.$pokemonId())),
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
