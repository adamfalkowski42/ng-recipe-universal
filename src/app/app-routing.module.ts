import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RecipesComponent} from "./recipes/recipes.component";
import {ShoppingListComponent} from "./shoppingList/shopping-list/shopping-list.component";

import {RecipesStartComponent} from "./recipes/recipes-start/recipes-start.component";
import {RecipeDetailComponent} from "./recipes/recipe-detail/recipe-detail.component";

const appRoutes: Routes = [
  {path: '', redirectTo: '/recipes', pathMatch: 'full'},
  {path: 'recipes', component: RecipesComponent, children: [
      {path: '', component: RecipesStartComponent},
      {path: ':id', component: RecipeDetailComponent},
    ]},
  {path: 'shopping-list', component: ShoppingListComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}