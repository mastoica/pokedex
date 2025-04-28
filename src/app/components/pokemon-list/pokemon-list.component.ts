import { Component, input } from '@angular/core';
import { SimplePokemon } from 'types/simple-pokemon.type';

import { PokemonListItemComponent } from '../pokemon-list-item/pokemon-list-item.component';

@Component({
    selector: 'app-pokemon-list',
    template: `
        <header>
            <nav>
                <button class="big-button blue"></button>
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
                    <app-pokemon-list-item [index]="$index" [pokemon]="pokemon" />
                }
            </section>
        </div>

        <footer></footer>
    `,
    styleUrl: './pokemon-list.component.scss',
    imports: [PokemonListItemComponent],
})
export class PokemonListComponent {
    readonly pokemonList = input<SimplePokemon[]>([]);
}
