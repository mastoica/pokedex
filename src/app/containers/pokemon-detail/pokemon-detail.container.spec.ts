import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonDetailContainer } from './pokemon-detail.container';

describe('PokemonDetailContainer', () => {
    let component: PokemonDetailContainer;
    let fixture: ComponentFixture<PokemonDetailContainer>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [PokemonDetailContainer],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PokemonDetailContainer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
