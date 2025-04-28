import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-evolution-trigger',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="evo-trigger-wrapper">
            <div class="evo-trigger" *ngIf="displayText">{{ displayText }}</div>
        </div>
    `,
    styles: [
        `
            .evo-trigger-wrapper {
                display: flex;
                justify-content: center;
                margin-bottom: 0.25rem;
            }

            .evo-trigger {
                font-size: 0.75rem;
                background-color: rgba(66, 153, 225, 0.6);
                color: white;
                padding: 0.25rem 0.5rem;
                border-radius: 0.25rem;
                display: inline-block;
            }
        `,
    ],
})
export class EvolutionTriggerComponent {
    @Input() minLevel?: number;
    @Input() itemName?: string;
    @Input() triggerName?: string;
    @Input() formatFn: (name: string) => string = (name) => name;

    get displayText(): string {
        if (this.minLevel) {
            return `Level ${this.minLevel}`;
        } else if (this.itemName) {
            return this.formatFn(this.itemName);
        } else if (this.triggerName) {
            return this.formatFn(this.triggerName);
        }
        return '';
    }
}
