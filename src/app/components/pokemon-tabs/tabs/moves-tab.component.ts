import { CommonModule } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { Pokemon } from 'types/pokemon.type';
import { TabContentComponent } from '../shared/tab-content.component';

@Component({
    selector: 'app-moves-tab',
    standalone: true,
    imports: [CommonModule, TabContentComponent],
    template: `
        <app-tab-content title="Moves">
            <div class="moves-container">
                <div class="moves-header flex justify-between items-center mb-3">
                    @if (pokemon.moves && pokemon.moves.length > 12) {
                        <button
                            class="show-all-btn text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                            (click)="toggleShowAllMoves()"
                        >
                            {{ showAllMoves() ? 'Show Less' : 'Show All' }}
                        </button>
                    }
                </div>
                @if (pokemon.moves) {
                    <div class="grid grid-cols-2 gap-2">
                        @for (move of getMovesToShow(); track move.move.name) {
                            <div
                                class="move-item p-2 bg-gray-700 rounded text-white hover:bg-gray-600 transition-colors"
                            >
                                <span class="capitalize">{{ formatMoveName(move.move.name) }}</span>
                            </div>
                        }
                    </div>

                    @if (!showAllMoves() && pokemon.moves.length > 12) {
                        <div class="mt-3 text-xs text-gray-400 flex justify-between items-center">
                            <span>Showing 12 of {{ pokemon.moves.length }} moves</span>
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
        </app-tab-content>
    `,
    styles: [
        `
            .moves-header {
                position: absolute;
                top: 0;
                right: 1rem;
                z-index: 5;
            }

            .move-item {
                transition: all 0.2s;
            }
            .move-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
            .show-all-btn,
            .show-all-text-btn {
                transition: all 0.2s;
            }
        `,
    ],
})
export class MovesTabComponent {
    @Input() pokemon!: Pokemon;
    readonly showAllMoves = signal<boolean>(false);

    formatMoveName(name: string): string {
        return name.replace(/-/g, ' ');
    }

    getMovesToShow() {
        if (!this.pokemon.moves) return [];
        return this.showAllMoves() ? this.pokemon.moves : this.pokemon.moves.slice(0, 12);
    }

    toggleShowAllMoves() {
        this.showAllMoves.update((current) => !current);
    }
}
