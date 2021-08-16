import { Injectable } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { Recipe } from './recipe.model';
import { ShoppingListService } from '../shoppingList/shopping-list/shopping-list.service';
import { Subject } from 'rxjs';
import {Store} from "@ngrx/store";
import * as ShoppingListActions from "../shoppingList/shopping-list/store/shopping-list.actions";
import * as fromShoppingList from "../shoppingList/shopping-list/store/shopping-list.reducer";

@Injectable()
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[] = [];
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'A test recipe',
  //     'Testing recipe',
  //     'https://image.shutterstock.com/image-photo/healthy-food-clean-eating-selection-260nw-722718097.jpg',
  //     [new Ingredient('Meat', 1), new Ingredient('French Fries', 20)]
  //   ),
  //   new Recipe(
  //     'A test recipe2',
  //     'Testing recipe2',
  //     'https://image.shutterstock.com/image-photo/chicken-fillet-salad-healthy-food-260nw-1721943142.jpg',
  //     [new Ingredient('Bread', 2), new Ingredient('Meat', 1)]
  //   ),
  // ];

  constructor(private slService: ShoppingListService,private store: Store<fromShoppingList.AppState>) {}

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
    // return this.recipes;
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientToShoppingList(ingredients: Ingredient[]) {
    // this.slService.addIngredients(ingredients);\
    this.store.dispatch(new ShoppingListActions.AddIngredients(ingredients));
  }


  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }
}
