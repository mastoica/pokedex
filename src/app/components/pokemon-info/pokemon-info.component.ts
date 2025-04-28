import { Component, input } from '@angular/core';
import { Pokemon } from 'types/pokemon.type';

import { TypewriterComponent } from '../../typewriter/typewriter.component';

@Component({
    selector: 'app-pokemon-info',
    imports: [TypewriterComponent],
    template: `
        <div class="relative w-full h-full flex flex-col justify-between p-4">
            <div class="flex flex-col z-10">
                <div class="mb-1">
                    <app-typewriter
                        [text]="pokemonInfo()?.name"
                        class="text-2xl font-bold capitalize text-green-400 tracking-wider"
                    />
                </div>

                <div class="text-gray-400 text-sm mb-3 font-mono">#{{ formatPokemonId(pokemonInfo()?.id) }}</div>

                <div class="flex gap-2">
                    @for (type of pokemonInfo()?.types; track type.type.name) {
                        <span
                            class="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider flex items-center"
                            [class]="getTypeColor(type.type.name)"
                        >
                            {{ type.type.name }}
                        </span>
                    }
                </div>
            </div>

            <div class="sprite-wrapper absolute bottom-0 right-4 w-32 h-32 flex items-center justify-center">
                @if (pokemonInfo(); as pokemonInfo) {
                    <div class="sprite-container relative w-full h-full flex items-center justify-center">
                        <div
                            class="pokemon-sprite w-full h-full bg-center bg-no-repeat bg-contain"
                            [style.background-image]="'url(' + pokemonInfo.sprites['front_default'] + ')'"
                            [style.image-rendering]="'pixelated'"
                        ></div>
                        <div class="sprite-shadow absolute bottom-[-5px] w-16 h-2 opacity-30 rounded-full"></div>
                    </div>
                }
            </div>
        </div>
    `,
    styleUrl: './pokemon-info.component.scss',
})
export class PokemonInfoComponent {
    readonly pokemonInfo = input<Pokemon>();

    formatPokemonId(id: string | undefined): string {
        if (!id) return '000';
        return id.toString().padStart(3, '0');
    }

    getTypeColor(type: string): string {
        const typeColors: Record<string, string> = {
            normal: 'bg-gray-400 text-white',
            fire: 'bg-red-500 text-white',
            water: 'bg-blue-500 text-white',
            electric: 'bg-yellow-400 text-gray-800',
            grass: 'bg-green-500 text-white',
            ice: 'bg-blue-200 text-gray-800',
            fighting: 'bg-red-700 text-white',
            poison: 'bg-purple-500 text-white',
            ground: 'bg-yellow-600 text-white',
            flying: 'bg-indigo-300 text-gray-800',
            psychic: 'bg-pink-500 text-white',
            bug: 'bg-lime-500 text-white',
            rock: 'bg-yellow-800 text-white',
            ghost: 'bg-purple-700 text-white',
            dragon: 'bg-indigo-600 text-white',
            dark: 'bg-gray-800 text-white',
            steel: 'bg-gray-500 text-white',
            fairy: 'bg-pink-300 text-gray-800',
        };

        return typeColors[type] || 'bg-gray-400 text-white';
    }
}
