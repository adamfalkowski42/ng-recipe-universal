import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {RecipeListComponent} from './recipes/recipe-list/recipe-list.component';
import {RecipeItemComponent} from './recipes/recipe-list/recipe-item/recipe-item.component';
import {RecipeDetailComponent} from './recipes/recipe-detail/recipe-detail.component';
import {RecipeComponent} from './recipes/recipe/recipe.component';
import {ShoppingListComponent} from './shoppingList/shopping-list/shopping-list.component';
import {ShoppingEditComponent} from './shoppingList/shopping-list/shopping-edit/shopping-edit.component';
import {RecipesComponent} from './recipes/recipes.component';
import {DropdownDirective} from './shared/dropdown.directive';
import {ShoppingListService} from './shoppingList/shopping-list/shopping-list.service';
import {AppRoutingModule} from "./app-routing.module";
import {RecipesStartComponent} from './recipes/recipes-start/recipes-start.component';
import {RecipeEditComponent} from './recipes/recipe-edit/recipe-edit.component';
import {RecipeService} from "./recipes/recipe.service";
import {HttpClientModule} from "@angular/common/http";
import {AuthComponent} from "./auth/auth.component";
import {LoadingSpinnerComponent} from "./shared/loading-spinner/loading-spinner.component";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    RecipesComponent,
    RecipeListComponent,
    RecipeItemComponent,
    RecipeDetailComponent,
    RecipeComponent,
    ShoppingListComponent,
    ShoppingEditComponent,
    DropdownDirective,
    RecipesStartComponent,
    RecipeEditComponent,
    AuthComponent,
    LoadingSpinnerComponent
  ],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule, HttpClientModule, AppRoutingModule],
  providers: [ShoppingListService, RecipeService],
  bootstrap: [AppComponent],
})
export class AppModule {
}
