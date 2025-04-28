import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
    selector: 'app-evolution-item',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="evo-pokemon-card" (click)="onPokemonClick.emit(speciesName)">
            <div class="evo-inner-card">
                <img [src]="imageUrl" [alt]="speciesName" class="evo-pokemon-image" />
                <div class="evo-pokemon-name">{{ displayName }}</div>
            </div>
        </div>
    `,
    styles: [
        `
            .evo-pokemon-card {
                background: rgba(0, 0, 0, 0.3);
                border-radius: 0.5rem;
                padding: 0.75rem;
                cursor: pointer;
                transition:
                    transform 0.15s ease-in-out,
                    background-color 0.15s ease-in-out;
            }

            .evo-pokemon-card:hover {
                background: rgba(0, 0, 0, 0.5);
                transform: translateY(-2px);
            }

            .evo-inner-card {
                display: flex;
                flex-direction: column;
                align-items: center;
            }

            .evo-pokemon-image {
                width: 60px;
                height: 60px;
                object-fit: contain;
            }

            .evo-pokemon-name {
                margin-top: 0.5rem;
                font-size: 0.875rem;
                color: white;
                text-align: center;
            }
        `,
    ],
})
export class EvolutionItemComponent {
    @Input() speciesName: string = '';
    @Input() imageUrl: string = '';
    @Input() displayName: string = '';
    @Output() onPokemonClick = new EventEmitter<string>();
}
