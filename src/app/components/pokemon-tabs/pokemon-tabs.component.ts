import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, inject, input, signal, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Pokemon } from 'pokenode-ts';
import { AbilitiesTabComponent } from './tabs/abilities-tab.component';
import { EvolutionTabComponent } from './tabs/evolution-tab.component';
import { MovesTabComponent } from './tabs/moves-tab.component';
import { StatsTabComponent } from './tabs/stats-tab.component';

@Component({
    selector: 'app-pokemon-tabs',
    standalone: true,
    imports: [CommonModule, StatsTabComponent, MovesTabComponent, AbilitiesTabComponent, EvolutionTabComponent],
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
                    (click)="setEvolutionTab()"
                >
                    Evolution
                </button>
            </div>

            <div class="tab-content bg-gray-800 p-4 rounded-b-lg rounded-tr-lg h-[260px] overflow-y-auto">
                @switch (activeTab()) {
                    @case ('stats') {
                        <app-stats-tab [pokemon]="pokemonData()"></app-stats-tab>
                    }
                    @case ('moves') {
                        <app-moves-tab [pokemon]="pokemonData()"></app-moves-tab>
                    }
                    @case ('abilities') {
                        <app-abilities-tab [pokemon]="pokemonData()"></app-abilities-tab>
                    }
                    @case ('evolution') {
                        <app-evolution-tab
                            #evolutionTab
                            [pokemon]="pokemonData()"
                            (pokemonSelected)="navigateToPokemon($event)"
                        ></app-evolution-tab>
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
    styles: [
        `
            .pokemon-tabs-container {
                height: 100%;
            }

            .tab-header {
                position: relative;
            }

            .tab-button {
                background-color: rgba(45, 55, 72, 0.8);
                color: #a0aec0;
                position: relative;
                z-index: 1;
            }

            .tab-button.active {
                background-color: #1a202c;
                color: white;
            }

            .tab-content {
                background-color: #1a202c;
                min-height: 220px;
            }
        `,
    ],
})
export class PokemonTabsComponent implements AfterViewInit {
    readonly pokemonData = input.required<Pokemon>();
    readonly activeTab = signal<'stats' | 'moves' | 'abilities' | 'evolution'>('stats');
    private isFirstRender = true;

    @ViewChild('evolutionTab') evolutionTabRef?: EvolutionTabComponent;

    private readonly router = inject(Router);

    constructor() {
        effect(() => {
            const pokemon = this.pokemonData();

            if (this.isFirstRender) {
                this.isFirstRender = false;
                return;
            }

            this.activeTab.set('stats');
        });
    }

    ngAfterViewInit() {
        setTimeout(() => {
            if (this.evolutionTabRef && this.pokemonData()) {
                this.evolutionTabRef.loadEvolutionData();
            }
        }, 100);
    }

    setEvolutionTab() {
        this.activeTab.set('evolution');

        setTimeout(() => {
            if (this.evolutionTabRef && this.pokemonData()) {
                this.evolutionTabRef.loadEvolutionData();
            }
        }, 0);
    }

    navigateToPokemon(name: string) {
        this.router.navigateByUrl(`/all(detail:${name})`);
    }
}
