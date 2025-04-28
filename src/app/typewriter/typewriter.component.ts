import { Component, OnChanges, input } from '@angular/core';

@Component({
    selector: 'app-typewriter',
    template: `
        <div class="typewriter-container overflow-hidden inline-block">
            @if (typeWriterText) {
                <p class="whitespace-nowrap m-0 animate-typing">{{ typeWriterText }}</p>
            }
        </div>
    `,
    styleUrl: './typewriter.component.scss',
})
export class TypewriterComponent implements OnChanges {
    readonly text = input<string>(undefined);

    typeWriterText = '';

    ngOnChanges(): void {
        this.typeWriterText = '';

        Promise.resolve().then(() => (this.typeWriterText = this.text()));
    }
}
