import {Injectable} from '@angular/core';
import {Ingredient} from '../shared/ingredient.model';
import {Recipe} from './recipe.model';
import {ShoppingListService} from "../shoppingList/shopping-list/shopping-list.service";
import {Subject} from "rxjs";

@Injectable()
export class RecipeService {

  recipesChanged = new Subject<Recipe[]>();
  private recipes: Recipe[];
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

  constructor(private slService: ShoppingListService) {
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(index: number) {
    return this.recipes[index];
  }

  addIngredientToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
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
