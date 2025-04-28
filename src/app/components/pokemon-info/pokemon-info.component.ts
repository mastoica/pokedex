import { animate, style, transition, trigger } from '@angular/animations';
import { Component, input } from '@angular/core';
import { Pokemon } from 'types/pokemon.type';
import { TypewriterComponent } from '../../typewriter/typewriter.component';

@Component({
    selector: 'app-pokemon-info',
    imports: [TypewriterComponent],
    template: `
        <div
            class="relative w-full h-full flex p-4 overflow-hidden bg-gradient-to-br from-gray-900 to-black rounded-md"
        >
            <!-- Pokemon info section - left side -->
            <div class="flex flex-col z-10 w-3/5 pr-4" [@fadeSlide]="pokemonInfo()?.name">
                <!-- Pokemon name with typewriter effect -->
                <div class="mb-1 relative">
                    <app-typewriter
                        [text]="pokemonInfo()?.name"
                        class="text-2xl font-bold capitalize text-green-400 tracking-wider glow-text"
                    />
                </div>

                <!-- ID and score badge -->
                <div class="flex gap-2 items-center mb-3">
                    <div class="text-gray-300 text-sm font-mono">#{{ formatPokemonId(pokemonInfo()?.id) }}</div>

                    <!-- Pokemon Score Badge -->
                    @if (pokemonInfo()?.stats) {
                        <div
                            class="pokemon-score-badge ml-2 flex items-center gap-1 px-2 py-0.5 rounded-full"
                            [class]="getScoreColorClass(calculatePokemonScore())"
                            [style.background-color]="getBadgeBackground(calculatePokemonScore())"
                            [@fadeIn]="pokemonInfo()?.name"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-3.5 w-3.5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                            <span class="text-xs font-semibold">{{ calculatePokemonScore() }}</span>
                        </div>
                    }
                </div>

                <!-- Type badges -->
                <div class="flex gap-2">
                    @for (type of pokemonInfo()?.types; track type.type.name) {
                        <span
                            class="px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider flex items-center shadow-sm"
                            [class]="getTypeColor(type.type.name)"
                            [@typeAnimation]="type.type.name"
                        >
                            {{ type.type.name }}
                        </span>
                    }
                </div>

                <!-- Power rating -->
                <div class="power-rating-container mt-6 mb-1" [@fadeIn]="pokemonInfo()?.name">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-medium text-gray-400">Power Rating</span>
                        <span class="text-xs font-semibold" [class]="getScoreColorClass(calculatePokemonScore())">
                            {{ getPowerRatingLabel(calculatePokemonScore()) }}
                        </span>
                    </div>
                    <div class="w-full bg-gray-700 rounded-full h-1.5 mt-1 overflow-hidden">
                        <div
                            class="h-full rounded-full transition-all duration-1000"
                            [style.width.%]="(calculatePokemonScore() / 700) * 100"
                            [style.background-color]="getScoreColor(calculatePokemonScore())"
                        ></div>
                    </div>
                </div>
            </div>

            <!-- Divider -->
            <div
                class="h-full w-px bg-gradient-to-b from-transparent via-gray-700 to-transparent opacity-40 mx-2"
            ></div>

            <!-- Sprite section - right side -->
            <div class="sprite-section relative w-2/5 flex items-center justify-center" [@fadeIn]="pokemonInfo()?.name">
                <!-- Background circle effect with transition -->
                <div
                    class="absolute w-36 h-36 rounded-full bg-opacity-20 transition-all duration-500"
                    [style.background]="getPokemonTypeGradient()"
                ></div>

                @if (pokemonInfo(); as pokemonInfo) {
                    <div class="sprite-container relative w-full h-full flex items-center justify-center">
                        <!-- Pokemon sprite with enhanced effects -->
                        <div
                            class="pokemon-sprite w-40 h-40 bg-center bg-no-repeat bg-contain translate-y-2"
                            [style.background-image]="'url(' + pokemonInfo.sprites['front_default'] + ')'"
                            [style.image-rendering]="'pixelated'"
                            [@spriteAnimation]="pokemonInfo?.name"
                        ></div>

                        <!-- Enhanced shadow -->
                        <div class="sprite-shadow absolute bottom-4 w-20 h-2 opacity-30 rounded-full"></div>
                    </div>
                }
            </div>
        </div>
    `,
    animations: [
        trigger('fadeIn', [
            transition(':enter', [style({ opacity: 0 }), animate('400ms ease-out', style({ opacity: 1 }))]),
            transition('* => *', [style({ opacity: 0 }), animate('400ms ease-out', style({ opacity: 1 }))]),
        ]),
        trigger('fadeSlide', [
            transition('* => *', [
                style({ opacity: 0, transform: 'translateX(-10px)' }),
                animate('500ms ease-out', style({ opacity: 1, transform: 'translateX(0)' })),
            ]),
        ]),
        trigger('typeAnimation', [
            transition('* => *', [
                style({ opacity: 0, transform: 'scale(0.8)' }),
                animate('600ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
            ]),
        ]),
        trigger('spriteAnimation', [
            transition('* => *', [
                style({ opacity: 0, transform: 'scale(0.7) translateY(20px)' }),
                animate(
                    '700ms cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    style({ opacity: 1, transform: 'scale(1) translateY(0)' }),
                ),
            ]),
        ]),
    ],
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

    // Get a gradient background based on Pokemon's types
    getPokemonTypeGradient(): string {
        if (!this.pokemonInfo() || !this.pokemonInfo().types || this.pokemonInfo().types.length === 0) {
            return 'radial-gradient(circle, rgba(75,85,99,0.4) 0%, rgba(17,24,39,0.1) 70%)';
        }

        const typeColors: Record<string, string> = {
            normal: 'rgba(168,168,120,0.5)',
            fire: 'rgba(240,128,48,0.5)',
            water: 'rgba(104,144,240,0.5)',
            electric: 'rgba(248,208,48,0.5)',
            grass: 'rgba(120,200,80,0.5)',
            ice: 'rgba(152,216,216,0.5)',
            fighting: 'rgba(192,48,40,0.5)',
            poison: 'rgba(160,64,160,0.5)',
            ground: 'rgba(224,192,104,0.5)',
            flying: 'rgba(168,144,240,0.5)',
            psychic: 'rgba(248,88,136,0.5)',
            bug: 'rgba(168,184,32,0.5)',
            rock: 'rgba(184,160,56,0.5)',
            ghost: 'rgba(112,88,152,0.5)',
            dragon: 'rgba(112,56,248,0.5)',
            dark: 'rgba(112,88,72,0.5)',
            steel: 'rgba(184,184,208,0.5)',
            fairy: 'rgba(238,153,172,0.5)',
        };

        // Get colors for the Pokemon's types
        const type1 = this.pokemonInfo().types[0].type.name;
        const color1 = typeColors[type1] || 'rgba(75,85,99,0.5)';

        // If Pokemon has two types, create a gradient
        if (this.pokemonInfo().types.length > 1) {
            const type2 = this.pokemonInfo().types[1].type.name;
            const color2 = typeColors[type2] || 'rgba(17,24,39,0.2)';
            return `radial-gradient(circle, ${color1} 0%, ${color2} 70%)`;
        }

        // If Pokemon has one type, create a fade effect
        return `radial-gradient(circle, ${color1} 0%, rgba(17,24,39,0.1) 70%)`;
    }

    calculatePokemonScore(): number {
        if (!this.pokemonInfo() || !this.pokemonInfo().stats) return 0;

        const stats = this.pokemonInfo().stats;
        let totalBaseStats = 0;

        for (const stat of stats) {
            totalBaseStats += stat.base_stat;
        }

        return totalBaseStats;
    }

    getScoreColor(score: number): string {
        if (score < 300) return '#f56565';
        if (score < 450) return '#ecc94b';
        if (score < 580) return '#48bb78';
        return '#805ad5';
    }

    // Background color for the score badge
    getBadgeBackground(score: number): string {
        if (score < 300) return 'rgba(245,101,101,0.2)';
        if (score < 450) return 'rgba(236,201,75,0.2)';
        if (score < 580) return 'rgba(72,187,120,0.2)';
        return 'rgba(128,90,213,0.2)';
    }

    getScoreColorClass(score: number): string {
        if (score < 300) return 'score-low';
        if (score < 450) return 'score-medium';
        if (score < 580) return 'score-high';
        return 'score-exceptional';
    }

    getPowerRatingLabel(score: number): string {
        if (score < 300) return 'Basic';
        if (score < 400) return 'Average';
        if (score < 500) return 'Strong';
        if (score < 580) return 'Elite';
        return 'Legendary';
    }
}
