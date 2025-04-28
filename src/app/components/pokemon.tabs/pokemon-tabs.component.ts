import { CommonModule } from '@angular/common';
import { Component, input, signal } from '@angular/core';
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
                                <button
                                    *ngIf="pokemonData().moves && pokemonData().moves.length > 12"
                                    class="show-all-btn text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                                    (click)="toggleShowAllMoves()"
                                >
                                    {{ showAllMoves() ? 'Show Less' : 'Show All' }}
                                </button>
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
                }
            </div>
        </div>
    `,
    styleUrl: './pokemon-tabs.component.scss',
})
export class PokemonTabsComponent {
    readonly pokemonData = input.required<Pokemon>();
    readonly activeTab = signal<'stats' | 'moves' | 'abilities'>('stats');
    readonly showAllMoves = signal<boolean>(false);

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
