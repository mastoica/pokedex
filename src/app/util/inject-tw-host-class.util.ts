import { ElementRef, Renderer2, assertInInjectionContext, effect, inject } from '@angular/core';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Apply Tailwind CSS classes to the host element of a component.
 * @param classFn function which returns a string, array or object of Tailwind CSS classes. Supports signals for conditional classes.
 *
 * @example
 * ```ts
 * export class MyComponent {
 *   constructor() {
 *     // Apply a static class
 *     injectTwHostClass(() => 'tw-flex');
 *
 *     // Apply static + dynamic classes with array syntax
 *     injectTwHostClass(() => ['tw-flex', this.mySignal() && 'tw-m-1']);
 *
 *     // Apply static + dynamic classes with object syntax
 *     injectTwHostClass(() => ({
 *       'tw-flex': true,
 *       'tw-m-1': this.mySignal()
 *     }));
 *   }
 * }
 *
 */
export function injectTwHostClass(classFn: () => ClassValue) {
    assertInInjectionContext(injectTwHostClass);

    const elementRef = inject(ElementRef);
    const renderer2 = inject(Renderer2);

    let previousClasses: string | undefined;

    effect(() => {
        const classes = twMerge(clsx(classFn()));

        if (previousClasses) {
            previousClasses
                .split(' ')
                .filter((cssClass) => !!cssClass)
                .forEach((cssClass) => renderer2.removeClass(elementRef.nativeElement, cssClass));
        }
        classes
            .split(' ')
            .filter((cssClass) => !!cssClass)
            .forEach((cssClass) => renderer2.addClass(elementRef.nativeElement, cssClass));

        previousClasses = classes;

        return;
    });
}
