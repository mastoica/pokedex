import { CommonModule } from '@angular/common';
import { Component, effect, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { PokemonApiService } from 'services/pokemon-api.service';
import { Pokemon } from 'types/pokemon.type';

@Component({
    selector: 'app-pokemon-tabs',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="pokemon-tabs-container">
            <div class="tab-header flex gap-1 mb-2">
                <button
                    class="tab-button flex-1 py-2 px-3 rounded-t-lg font-medium text-sm transition-all duration-200"
                    [class.active]="activeTab() === 'stats'"
                    (click)="activeTab.set('stats')"
                >
                    Stats
                </button>
                <button
                    class="tab-button flex-1 py-2 px-3 rounded-t-lg font-medium text-sm transition-all duration-200"
                    [class.active]="activeTab() === 'moves'"
                    (click)="activeTab.set('moves')"
                >
                    Moves
                </button>
                <button
                    class="tab-button flex-1 py-2 px-3 rounded-t-lg font-medium text-sm transition-all duration-200"
                    [class.active]="activeTab() === 'abilities'"
                    (click)="activeTab.set('abilities')"
                >
                    Abilities
                </button>
                <button
                    class="tab-button flex-1 py-2 px-3 rounded-t-lg font-medium text-sm transition-all duration-200"
                    [class.active]="activeTab() === 'evolution'"
                    (click)="loadEvolutionChain()"
                >
                    Evolution
                </button>
            </div>

            <div class="tab-content bg-gray-800 p-4 rounded-b-lg rounded-tr-lg h-[260px] overflow-y-auto">
                @switch (activeTab()) {
                    @case ('stats') {
                        <div class="stats-container">
                            <h3 class="text-lg font-bold mb-3 text-white">Base Stats</h3>
                            @if (pokemonData().stats) {
                                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    @for (stat of pokemonData().stats; track stat.stat.name) {
                                        <div class="stat-item mb-2">
                                            <div class="flex justify-between items-center mb-1">
                                                <div class="text-sm capitalize text-gray-300">
                                                    {{ formatStatName(stat.stat.name) }}
                                                </div>
                                                <span class="text-sm font-medium text-white">{{ stat.base_stat }}</span>
                                            </div>
                                            <div class="w-full bg-gray-700 rounded-full h-2.5 overflow-hidden">
                                                <div
                                                    class="h-full rounded-full"
                                                    [style.width.%]="(stat.base_stat / 255) * 100"
                                                    [style.background-color]="getStatColor(stat.base_stat)"
                                                ></div>
                                            </div>
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    }
                    @case ('moves') {
                        <div class="moves-container">
                            <div class="flex justify-between items-center mb-3">
                                <h3 class="text-lg font-bold text-white">Moves</h3>
                                @if (pokemonData().moves && pokemonData().moves.length > 12) {
                                    <button
                                        class="show-all-btn text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                        (click)="toggleShowAllMoves()"
                                    >
                                        {{ showAllMoves() ? 'Show Less' : 'Show All' }}
                                    </button>
                                }
                            </div>
                            @if (pokemonData().moves) {
                                <div class="grid grid-cols-2 gap-2">
                                    @for (move of getMovesToShow(); track move.move.name) {
                                        <div
                                            class="move-item p-2 bg-gray-700 rounded text-white hover:bg-gray-600 transition-colors"
                                        >
                                            <span class="capitalize">{{ formatMoveName(move.move.name) }}</span>
                                        </div>
                                    }
                                </div>

                                @if (!showAllMoves() && pokemonData().moves.length > 12) {
                                    <div class="mt-3 text-xs text-gray-400 flex justify-between items-center">
                                        <span>Showing 12 of {{ pokemonData().moves.length }} moves</span>
                                        <button
                                            class="show-all-text-btn text-blue-400 hover:text-blue-300 transition-colors"
                                            (click)="showAllMoves.set(true)"
                                        >
                                            Show All Moves
                                        </button>
                                    </div>
                                }
                            }
                        </div>
                    }
                    @case ('abilities') {
                        <div class="abilities-container">
                            <h3 class="text-lg font-bold mb-3 text-white">Abilities</h3>
                            @if (pokemonData().abilities) {
                                <div class="grid gap-3">
                                    @for (ability of pokemonData().abilities; track ability.ability.name) {
                                        <div
                                            class="ability-item p-3 bg-gray-700 rounded text-white hover:bg-gray-600 transition-colors"
                                        >
                                            <div class="font-medium capitalize">
                                                {{ formatAbilityName(ability.ability.name) }}
                                            </div>
                                            @if (ability.is_hidden) {
                                                <div class="text-xs mt-1 text-purple-300">(Hidden Ability)</div>
                                            }
                                        </div>
                                    }
                                </div>
                            }
                        </div>
                    }
                    @case ('evolution') {
                        <div class="evolution-container relative">
                            <h3 class="text-lg font-bold mb-3 text-white">Evolution Chain</h3>

                            @if (isLoadingEvolution()) {
                                <div class="flex justify-center items-center h-32">
                                    <div class="evolution-loader"></div>
                                </div>
                            } @else if (evolutionChain()) {
                                <div class="evo-chain">
                                    @if (evolutionChain().chain) {
                                        <div class="evo-row">
                                            <div
                                                class="evo-pokemon-card"
                                                (click)="navigateToPokemon(evolutionChain().chain.species.name)"
                                            >
                                                <div class="evo-inner-card">
                                                    <img
                                                        [src]="getPokemonImage(evolutionChain().chain.species.url)"
                                                        alt="{{ evolutionChain().chain.species.name }}"
                                                        class="evo-pokemon-image"
                                                    />
                                                    <div class="evo-pokemon-name">
                                                        {{ formatName(evolutionChain().chain.species.name) }}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        @if (evolutionChain().chain.evolves_to?.length) {
                                            <div class="evo-arrow">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                    class="w-5 h-5"
                                                >
                                                    <path
                                                        fill-rule="evenodd"
                                                        d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                                        clip-rule="evenodd"
                                                    />
                                                </svg>
                                            </div>
                                        }

                                        @if (evolutionChain().chain.evolves_to?.length) {
                                            <div class="evo-row">
                                                <div class="evo-row-cards">
                                                    @for (
                                                        evolution of evolutionChain().chain.evolves_to;
                                                        track evolution.species.name
                                                    ) {
                                                        <div class="evo-card-container">
                                                            <div class="evo-trigger-wrapper">
                                                                @if (evolution.evolution_details?.[0]?.min_level) {
                                                                    <div class="evo-trigger">
                                                                        Level
                                                                        {{ evolution.evolution_details[0].min_level }}
                                                                    </div>
                                                                } @else if (
                                                                    evolution.evolution_details?.[0]?.item?.name
                                                                ) {
                                                                    <div class="evo-trigger">
                                                                        {{
                                                                            formatName(
                                                                                evolution.evolution_details[0].item.name
                                                                            )
                                                                        }}
                                                                    </div>
                                                                } @else if (
                                                                    evolution.evolution_details?.[0]?.trigger?.name
                                                                ) {
                                                                    <div class="evo-trigger">
                                                                        {{
                                                                            formatName(
                                                                                evolution.evolution_details[0].trigger
                                                                                    .name
                                                                            )
                                                                        }}
                                                                    </div>
                                                                }
                                                            </div>

                                                            <div
                                                                class="evo-pokemon-card"
                                                                (click)="navigateToPokemon(evolution.species.name)"
                                                            >
                                                                <div class="evo-inner-card">
                                                                    <img
                                                                        [src]="getPokemonImage(evolution.species.url)"
                                                                        alt="{{ evolution.species.name }}"
                                                                        class="evo-pokemon-image"
                                                                    />
                                                                    <div class="evo-pokemon-name">
                                                                        {{ formatName(evolution.species.name) }}
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            @if (evolution.evolves_to?.length) {
                                                                <div class="evo-arrow">
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        viewBox="0 0 20 20"
                                                                        fill="currentColor"
                                                                        class="w-5 h-5"
                                                                    >
                                                                        <path
                                                                            fill-rule="evenodd"
                                                                            d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z"
                                                                            clip-rule="evenodd"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            }

                                                            @if (evolution.evolves_to?.length) {
                                                                <div class="evo-card-container nested">
                                                                    @for (
                                                                        finalEvo of evolution.evolves_to;
                                                                        track finalEvo.species.name
                                                                    ) {
                                                                        <div class="evo-final-evo">
                                                                            <div class="evo-trigger-wrapper">
                                                                                @if (
                                                                                    finalEvo.evolution_details?.[0]
                                                                                        ?.min_level
                                                                                ) {
                                                                                    <div class="evo-trigger">
                                                                                        Level
                                                                                        {{
                                                                                            finalEvo
                                                                                                .evolution_details[0]
                                                                                                .min_level
                                                                                        }}
                                                                                    </div>
                                                                                } @else if (
                                                                                    finalEvo.evolution_details?.[0]
                                                                                        ?.item?.name
                                                                                ) {
                                                                                    <div class="evo-trigger">
                                                                                        {{
                                                                                            formatName(
                                                                                                finalEvo
                                                                                                    .evolution_details[0]
                                                                                                    .item.name
                                                                                            )
                                                                                        }}
                                                                                    </div>
                                                                                } @else if (
                                                                                    finalEvo.evolution_details?.[0]
                                                                                        ?.trigger?.name
                                                                                ) {
                                                                                    <div class="evo-trigger">
                                                                                        {{
                                                                                            formatName(
                                                                                                finalEvo
                                                                                                    .evolution_details[0]
                                                                                                    .trigger.name
                                                                                            )
                                                                                        }}
                                                                                    </div>
                                                                                }
                                                                            </div>

                                                                            <div
                                                                                class="evo-pokemon-card"
                                                                                (click)="
                                                                                    navigateToPokemon(
                                                                                        finalEvo.species.name
                                                                                    )
                                                                                "
                                                                            >
                                                                                <div class="evo-inner-card">
                                                                                    <img
                                                                                        [src]="
                                                                                            getPokemonImage(
                                                                                                finalEvo.species.url
                                                                                            )
                                                                                        "
                                                                                        alt="{{
                                                                                            finalEvo.species.name
                                                                                        }}"
                                                                                        class="evo-pokemon-image"
                                                                                    />
                                                                                    <div class="evo-pokemon-name">
                                                                                        {{
                                                                                            formatName(
                                                                                                finalEvo.species.name
                                                                                            )
                                                                                        }}
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            }
                                                        </div>
                                                    }
                                                </div>
                                            </div>
                                        }
                                    } @else {
                                        <div class="text-gray-300 text-center">No evolution data available</div>
                                    }
                                </div>
                            } @else {
                                <div class="text-gray-300 text-center">No evolution data available</div>
                            }
                        </div>
                    }
                    @default {
                        <div class="flex justify-center items-center h-full">
                            <div class="text-gray-400 text-center">
                                <div class="text-lg mb-2">Select a tab to view data</div>
                                <div class="text-sm">Stats, Moves, Abilities, or Evolution</div>
                            </div>
                        </div>
                    }
                }
            </div>
        </div>
    `,
    styleUrl: './pokemon-tabs.component.scss',
})
export class PokemonTabsComponent {
    readonly pokemonData = input.required<Pokemon>();
    readonly activeTab = signal<'stats' | 'moves' | 'abilities' | 'evolution'>('stats');
    readonly showAllMoves = signal<boolean>(false);
    readonly evolutionChain = signal<any>(null);
    readonly isLoadingEvolution = signal<boolean>(false);

    private pokemonImagesCache: Record<string, string> = {};
    private isFirstRender = true;

    private readonly pokemonService = inject(PokemonApiService);
    private readonly router = inject(Router);

    constructor() {
        effect(() => {
            const pokemon = this.pokemonData();

            if (this.isFirstRender) {
                this.isFirstRender = false;
                return;
            }

            this.evolutionChain.set(null);
        });
    }

    async loadEvolutionChain() {
        this.activeTab.set('evolution');

        if (this.evolutionChain()) return;

        try {
            this.isLoadingEvolution.set(true);

            const species = await firstValueFrom(this.pokemonService.getPokemonSpecies(this.pokemonData().name));

            const evolutionUrl = species.evolution_chain.url;
            const evolutionId = evolutionUrl.split('/').filter(Boolean).pop();

            const evolutionData = await firstValueFrom(this.pokemonService.getEvolutionChain(evolutionId));

            this.evolutionChain.set(evolutionData);
        } catch (error) {
            console.error('Error loading evolution chain:', error);
        } finally {
            this.isLoadingEvolution.set(false);
        }
    }

    navigateToPokemon(name: string) {
        this.router.navigateByUrl(`/all(detail:${name})`);
    }

    getPokemonImage(speciesUrl: string): string {
        if (this.pokemonImagesCache[speciesUrl]) {
            return this.pokemonImagesCache[speciesUrl];
        }

        const matches = speciesUrl.match(/\/pokemon-species\/(\d+)/);
        if (matches && matches[1]) {
            const id = matches[1];
            const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;
            this.pokemonImagesCache[speciesUrl] = imageUrl;
            return imageUrl;
        }

        return 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
    }

    formatName(name: string): string {
        if (!name) return '';
        return name
            .split('-')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
    }

    getMovesToShow() {
        if (!this.pokemonData().moves) return [];
        return this.showAllMoves() ? this.pokemonData().moves : this.pokemonData().moves.slice(0, 12);
    }

    toggleShowAllMoves() {
        this.showAllMoves.update((current) => !current);
    }

    formatStatName(name: string): string {
        switch (name) {
            case 'hp':
                return 'HP';
            case 'attack':
                return 'Attack';
            case 'defense':
                return 'Defense';
            case 'special-attack':
                return 'Sp. Attack';
            case 'special-defense':
                return 'Sp. Defense';
            case 'speed':
                return 'Speed';
            default:
                return name.replace(/-/g, ' ');
        }
    }

    formatMoveName(name: string): string {
        return name.replace(/-/g, ' ');
    }

    formatAbilityName(name: string): string {
        return name.replace(/-/g, ' ');
    }

    getStatColor(value: number): string {
        if (value < 50) return '#f56565';
        if (value < 90) return '#ecc94b';
        return '#48bb78';
    }
}
