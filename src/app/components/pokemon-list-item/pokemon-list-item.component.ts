import { Component, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SimplePokemon } from 'types/simple-pokemon.type';

@Component({
    selector: 'app-pokemon-list-item',
    template: `
        <div
            class="flex items-center p-3 rounded-md cursor-pointer transition-all duration-200 group"
            [class.selected-pokemon]="isSelected()"
            [class.hover:bg-gray-700]="!isSelected()"
            [class.hover:translate-x-1]="!isSelected()"
            (click)="navigateToPokemon()"
        >
            <div class="text-gray-400 font-mono text-sm w-16" [class.text-blue-300]="isSelected()">
                {{ getFormattedId() }}
            </div>
            <div
                class="capitalize font-medium transition-colors"
                [class.text-white]="!isSelected()"
                [class.text-blue-300]="isSelected()"
                [class.group-hover:text-blue-300]="!isSelected()"
            >
                {{ pokemon().name }}
            </div>
            <div
                class="ml-auto transition-opacity"
                [class.opacity-100]="isSelected()"
                [class.opacity-0]="!isSelected()"
                [class.group-hover:opacity-100]="!isSelected()"
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-4 w-4 text-blue-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </div>
        </div>
    `,
    styleUrl: './pokemon-list-item.component.scss',
})
export class PokemonListItemComponent {
    readonly index = input.required<number>();
    readonly pokemon = input.required<SimplePokemon>();
    private readonly router = inject(Router);
    private readonly route = inject(ActivatedRoute);

    getFormattedId(): string {
        const idMatch = this.pokemon().url.match(/\/([0-9]+)\/$/);
        const id = idMatch ? parseInt(idMatch[1], 10) : this.index() + 1;
        return `#${id.toString().padStart(3, '0')}`;
    }

    isSelected(): boolean {
        const url = this.router.url;
        // Extract the Pokemon name from the URL (detail:name)
        const match = url.match(/detail:([^)]+)/);
        if (!match) return false;

        // Check for exact name match
        return match[1] === this.pokemon().name;
    }

    navigateToPokemon() {
        const name = this.pokemon().name;
        this.router.navigateByUrl(`/all(detail:${name})`);
    }
}
