import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Pokemon } from 'pokenode-ts';
import { TabContentComponent } from '../shared/tab-content.component';

@Component({
    selector: 'app-stats-tab',
    standalone: true,
    imports: [CommonModule, TabContentComponent],
    template: `
        <app-tab-content title="Base Stats">
            @if (pokemon.stats) {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    @for (stat of pokemon.stats; track stat.stat.name) {
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
        </app-tab-content>
    `,
    styles: [
        `
            .stat-item {
                transition: transform 0.2s;
            }
            .stat-item:hover {
                transform: translateX(3px);
            }
        `,
    ],
})
export class StatsTabComponent {
    @Input() pokemon!: Pokemon;

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

    getStatColor(value: number): string {
        if (value < 50) return '#f56565';
        if (value < 90) return '#ecc94b';
        return '#48bb78';
    }
}
