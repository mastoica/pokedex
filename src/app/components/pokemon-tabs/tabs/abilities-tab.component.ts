import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Pokemon } from 'pokenode-ts';
import { TabContentComponent } from '../shared/tab-content.component';

@Component({
    selector: 'app-abilities-tab',
    standalone: true,
    imports: [CommonModule, TabContentComponent],
    template: `
        <app-tab-content title="Abilities">
            @if (pokemon.abilities) {
                <div class="grid gap-3">
                    @for (ability of pokemon.abilities; track ability.ability.name) {
                        <div
                            class="ability-item p-3 bg-gray-700 rounded text-white hover:bg-gray-600 transition-colors"
                        >
                            <div class="font-medium capitalize">
                                {{ formatAbilityName(ability.ability.name) }}
                            </div>
                            @if (ability.is_hidden) {
                                <div class="text-xs mt-1 text-purple-300">(Hidden Ability)</div>
                            }
                        </div>
                    }
                </div>
            }
        </app-tab-content>
    `,
    styles: [
        `
            .ability-item {
                transition: all 0.2s;
            }
            .ability-item:hover {
                transform: translateY(-2px);
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
            }
        `,
    ],
})
export class AbilitiesTabComponent {
    @Input() pokemon!: Pokemon;

    formatAbilityName(name: string): string {
        return name.replace(/-/g, ' ');
    }
}
