import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllPokemonListContainer } from './all-pokemon-list.container';

describe('AllPokemonListContainer', () => {
    let component: AllPokemonListContainer;
    let fixture: ComponentFixture<AllPokemonListContainer>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [AllPokemonListContainer],
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AllPokemonListContainer);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
