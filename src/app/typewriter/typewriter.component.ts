import { Component, OnChanges, input } from '@angular/core';

@Component({
    selector: 'app-typewriter',
    template: `
        @if (typeWriterText) {
            <p>{{ typeWriterText }}</p>
        }
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
