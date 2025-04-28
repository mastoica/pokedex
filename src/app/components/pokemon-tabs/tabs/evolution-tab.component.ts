import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, signal, SimpleChanges } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { PokemonApiService } from 'services/pokemon-api.service';
import { Pokemon } from 'types/pokemon.type';
import { EvolutionItemComponent } from '../shared/evolution-item.component';
import { EvolutionTriggerComponent } from '../shared/evolution-trigger.component';
import { TabContentComponent } from '../shared/tab-content.component';

@Component({
    selector: 'app-evolution-tab',
    standalone: true,
    imports: [CommonModule, TabContentComponent, EvolutionItemComponent, EvolutionTriggerComponent],
    template: `
        <app-tab-content title="Evolution Chain">
            @if (isLoading()) {
                <div class="flex justify-center items-center h-32">
                    <div class="evolution-loader"></div>
                </div>
            } @else if (evolutionChain()) {
                <div class="evo-chain">
                    @if (evolutionChain().chain) {
                        <div class="evo-row">
                            <div class="evo-pokemon-card">
                                <app-evolution-item
                                    [speciesName]="evolutionChain().chain.species.name"
                                    [imageUrl]="getPokemonImage(evolutionChain().chain.species.url)"
                                    [displayName]="formatName(evolutionChain().chain.species.name)"
                                    (onPokemonClick)="pokemonSelected.emit($event)"
                                ></app-evolution-item>
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
                                            <app-evolution-trigger
                                                [minLevel]="evolution.evolution_details?.[0]?.min_level"
                                                [itemName]="evolution.evolution_details?.[0]?.item?.name"
                                                [triggerName]="evolution.evolution_details?.[0]?.trigger?.name"
                                                [formatFn]="formatName.bind(this)"
                                            ></app-evolution-trigger>

                                            <app-evolution-item
                                                [speciesName]="evolution.species.name"
                                                [imageUrl]="getPokemonImage(evolution.species.url)"
                                                [displayName]="formatName(evolution.species.name)"
                                                (onPokemonClick)="pokemonSelected.emit($event)"
                                            ></app-evolution-item>

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
                                                            <app-evolution-trigger
                                                                [minLevel]="finalEvo.evolution_details?.[0]?.min_level"
                                                                [itemName]="finalEvo.evolution_details?.[0]?.item?.name"
                                                                [triggerName]="
                                                                    finalEvo.evolution_details?.[0]?.trigger?.name
                                                                "
                                                                [formatFn]="formatName.bind(this)"
                                                            ></app-evolution-trigger>

                                                            <app-evolution-item
                                                                [speciesName]="finalEvo.species.name"
                                                                [imageUrl]="getPokemonImage(finalEvo.species.url)"
                                                                [displayName]="formatName(finalEvo.species.name)"
                                                                (onPokemonClick)="pokemonSelected.emit($event)"
                                                            ></app-evolution-item>
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
        </app-tab-content>
    `,
    styles: [
        `
            .evolution-loader {
                border: 3px solid rgba(255, 255, 255, 0.3);
                border-radius: 50%;
                border-top: 3px solid #fff;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
            }

            @keyframes spin {
                0% {
                    transform: rotate(0deg);
                }
                100% {
                    transform: rotate(360deg);
                }
            }

            .evo-chain {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .evo-row {
                margin: 0.5rem 0;
                width: 100%;
                display: flex;
                justify-content: center;
            }

            .evo-row-cards {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 1rem;
            }

            .evo-card-container {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .evo-card-container.nested {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: center;
                gap: 1rem;
                margin-top: 0.5rem;
            }

            .evo-final-evo {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .evo-arrow {
                display: flex;
                justify-content: center;
                color: #4fd1c5;
                margin: 0.5rem 0;
            }
        `,
    ],
})
export class EvolutionTabComponent implements OnChanges {
    @Input() pokemon!: Pokemon;
    @Output() pokemonSelected = new EventEmitter<string>();

    readonly evolutionChain = signal<any>(null);
    readonly isLoading = signal<boolean>(false);

    private pokemonImagesCache: Record<string, string> = {};

    private readonly pokemonService = inject(PokemonApiService);

    ngOnChanges(changes: SimpleChanges) {
        if (changes['pokemon']) {
            this.evolutionChain.set(null);
            this.loadEvolutionData();
        }
    }

    async loadEvolutionData() {
        if (this.evolutionChain() || !this.pokemon?.name) return;

        try {
            this.isLoading.set(true);

            const species = await firstValueFrom(this.pokemonService.getPokemonSpecies(this.pokemon.name));
            const evolutionUrl = species.evolution_chain.url;
            const evolutionId = evolutionUrl.split('/').filter(Boolean).pop();
            const evolutionData = await firstValueFrom(this.pokemonService.getEvolutionChain(evolutionId));

            this.evolutionChain.set(evolutionData);
        } catch (error) {
            console.error('Error loading evolution chain:', error);
        } finally {
            this.isLoading.set(false);
        }
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
}
