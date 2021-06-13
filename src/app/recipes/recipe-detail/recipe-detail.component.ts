import {Component, OnInit} from '@angular/core';
import {Recipe} from '../recipe.model';
import {RecipeService} from "../recipe.service";
import {ActivatedRoute, Params, Router} from "@angular/router";


@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;
  id: number;


  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        console.log(this.id.valueOf());
        this.recipe = this.recipeService.getRecipe(this.id);
      }
    )
  }


  addShoppingList() {
    this.recipeService.addIngredientToShoppingList(this.recipe.ingredients);

  }

  onEditRecipe() {
    //this link works as is
    this.router.navigate(['edit'], {relativeTo: this.route});

    this.router.navigate(['../',this.id,'edit'],{relativeTo: this.route});
  }

  onDeleteRecipe() {

  }
}
