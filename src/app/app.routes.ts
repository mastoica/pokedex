import { Routes } from '@angular/router';

import { AllPokemonListContainer } from './containers/all-pokemon-list/all-pokemon-list.container';
import { PokemonDetailContainer } from './containers/pokemon-detail/pokemon-detail.container';

export const routes: Routes = [
    { path: 'all', component: AllPokemonListContainer },
    { path: ':pokemonId', component: PokemonDetailContainer, outlet: 'detail' },

    { path: '', redirectTo: '/all(detail:bulbasaur)', pathMatch: 'full' },
];
