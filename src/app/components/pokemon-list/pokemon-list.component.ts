import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, inject, input, OnInit, output } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NamedAPIResource } from 'pokenode-ts';
import { filter } from 'rxjs';
import { PokemonListItemComponent } from '../pokemon-list-item/pokemon-list-item.component';
@Component({
    selector: 'app-pokemon-list',
    template: `
        <header>
            <nav>
                <button class="big-button blue sprite-container">
                    @if (currentSelectedPokemonId) {
                        <img
                            [src]="
                                'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/' +
                                currentSelectedPokemonId +
                                '.png'
                            "
                            alt="Selected Pokemon"
                            class="pokemon-sprite"
                        />
                    }
                </button>
            </nav>
            <div class="nav-shadow"></div>

            <div class="top-bar">
                <button class="small-button red"></button>
                <button class="small-button yellow"></button>
                <button class="small-button green"></button>
            </div>
        </header>

        <div class="section-wrapper">
            <section>
                @for (pokemon of pokemonList(); let index = $index; track pokemon.name) {
                    <app-pokemon-list-item
                        [index]="$index"
                        [pokemon]="pokemon"
                        (click)="updateSelectedPokemon(pokemon)"
                    />
                }

                <div class="load-more-container">
                    @if (isLoading()) {
                        <div class="spinner">
                            <div class="spinner-inner"></div>
                        </div>
                    }

                    @if (hasNextPage() && !isLoading()) {
                        <button class="load-more-button" (click)="loadMore.emit()">
                            <span>Load More</span>
                        </button>
                    }
                </div>
            </section>
        </div>

        <footer></footer>
    `,
    styleUrl: './pokemon-list.component.scss',
    imports: [PokemonListItemComponent, CommonModule],
    styles: [
        `
            .sprite-container {
                display: flex !important;
                align-items: center;
                justify-content: center;
                position: relative;
            }

            .pokemon-sprite {
                width: 80px;
                height: 80px;
                object-fit: contain;
                image-rendering: pixelated;
                transform: scale(1.2);
                position: absolute;
            }
        `,
    ],
})
export class PokemonListComponent implements OnInit, AfterViewInit {
    readonly pokemonList = input<NamedAPIResource[]>([]);
    readonly isLoading = input<boolean>(false);
    readonly hasNextPage = input<boolean>(false);
    readonly loadMore = output<void>();

    private readonly router = inject(Router);
    private readonly cdRef = inject(ChangeDetectorRef);
    currentSelectedPokemonId: string | null = null;

    ngOnInit() {
        // Listen for router events
        this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
            this.checkCurrentRoute();
        });

        // Initial check on component load
        this.checkCurrentRoute();
    }

    ngAfterViewInit() {
        // Double check after view init to catch any missed initializations
        setTimeout(() => {
            if (!this.currentSelectedPokemonId) {
                this.checkCurrentRoute();
                this.cdRef.detectChanges();
            }
        }, 100);
    }

    checkCurrentRoute() {
        const url = this.router.url;
        const match = url.match(/detail:([^)]+)/);

        if (match) {
            const selectedName = match[1];
            const pokemon = this.findPokemonByName(selectedName);

            if (pokemon) {
                const idMatch = pokemon.url.match(/\/([0-9]+)\/$/);
                this.currentSelectedPokemonId = idMatch ? idMatch[1] : null;
                this.cdRef.detectChanges();
            }
        }
    }

    findPokemonByName(name: string): NamedAPIResource | undefined {
        // First try to find in the current list
        let pokemon = this.pokemonList().find((p) => p.name === name);

        // If not found and we don't have any, schedule a recheck later when data might be loaded
        if (!pokemon && this.pokemonList().length === 0) {
            setTimeout(() => {
                this.checkCurrentRoute();
            }, 500);
        }

        return pokemon;
    }

    updateSelectedPokemon(pokemon: NamedAPIResource) {
        const idMatch = pokemon.url.match(/\/([0-9]+)\/$/);
        if (idMatch) {
            this.currentSelectedPokemonId = idMatch[1];
        }
    }
}
