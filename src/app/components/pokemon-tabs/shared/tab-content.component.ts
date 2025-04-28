import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-tab-content',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="tab-content-container">
            <div class="tab-title-container relative">
                <h3 class="text-lg font-bold mb-3 text-white">{{ title }}</h3>
            </div>
            <ng-content></ng-content>
        </div>
    `,
    styles: [
        `
            .tab-content-container {
                height: 100%;
                position: relative;
            }

            .tab-title-container {
                position: relative;
                z-index: 1;
            }
        `,
    ],
})
export class TabContentComponent {
    @Input() title: string = '';
}
