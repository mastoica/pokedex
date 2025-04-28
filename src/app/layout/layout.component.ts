import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { injectTwHostClass } from 'util/inject-tw-host-class.util';

@Component({
    selector: 'app-layout',
    imports: [RouterOutlet],
    template: `
        <!-- Pokemon list -->
        <div class="pokemon-list">
            <router-outlet></router-outlet>
        </div>

        <div class="divider"><div class="divider-hl"></div></div>

        <!-- Pokemon Detail -->
        <div class="box-shadow">
            <div class="pokemon-detail-wrapper">
                <router-outlet name="detail"></router-outlet>
            </div>
        </div>
    `,
    styleUrl: './layout.component.scss',
})
export class LayoutComponent {
    constructor() {
        injectTwHostClass(() => 'max-w-screen-2xl h-full mx-auto flex flex-row p-24');
    }
}
