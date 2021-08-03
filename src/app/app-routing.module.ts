import { NgModule } from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';


const appRoutes: Routes = [
  { path: '', redirectTo: '/recipes', pathMatch: 'full' },
  //old style
  // { path: 'recipes', loadChildren:'./recipes/recipes.module#RecipesModule'}
  //new style
  { path: 'recipes', loadChildren: ()=> import('./recipes/recipes.module').then(m=> m.RecipesModule)},
  { path: 'login', loadChildren: ()=> import('./auth/auth.module').then(m=> m.AuthModule)},
  { path: 'shopping-list', loadChildren: ()=> import('./shoppingList/shopping-list.module').then(m=> m.ShoppingListModule)},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, {preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
