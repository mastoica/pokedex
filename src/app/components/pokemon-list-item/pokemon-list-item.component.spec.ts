import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { PokemonListItemComponent } from './pokemon-list-item.component';

describe('PokemonListItemComponent', () => {
    let component: PokemonListItemComponent;
    let fixture: ComponentFixture<PokemonListItemComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PokemonListItemComponent],
            providers: [provideRouter([])],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PokemonListItemComponent);
        fixture.componentRef.setInput('pokemon', { id: '1', name: 'bulbasaur' });
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
