import { Component, input } from '@angular/core';
import { Pokemon } from 'types/pokemon.type';

import { TypewriterComponent } from '../../typewriter/typewriter.component';

@Component({
    selector: 'app-pokemon-info',
    imports: [TypewriterComponent],
    template: `
        <app-typewriter [text]="pokemonInfo()?.name" />

        <div class="sprite-wrapper">
            @if (pokemonInfo(); as pokemonInfo) {
                <div
                    class="sprite"
                    [style.background-image]="'url(' + pokemonInfo.sprites['front_default'] + ')'"
                ></div>
            }
        </div>
    `,
    styleUrl: './pokemon-info.component.scss',
})
export class PokemonInfoComponent {
    readonly pokemonInfo = input<Pokemon>();
}
