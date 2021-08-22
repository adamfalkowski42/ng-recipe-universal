import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Params, Router} from "@angular/router";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../recipe.service";
import {Store} from "@ngrx/store";
import * as fromApp from '../../store/app.reducer';
import {map} from "rxjs/operators";
import * as RecipesActions from '../../recipes/store/recipes.action';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrls: ['./recipe-edit.component.css']
})
export class RecipeEditComponent implements OnInit, OnDestroy {
  id: number;
  editMode = false;
  recipeForm: FormGroup;
  private storeSub: Subscription;

  constructor(private route: ActivatedRoute,
              private recipeService: RecipeService,
              private router: Router,
              private store: Store<fromApp.AppState>) {
  }

  get controls() {
    return (<FormArray>this.recipeForm.get('ingredients')).controls;
  }

  ngOnInit(): void {
    this.route.params.subscribe(
      (params: Params) => {
        this.id = +params['id'];
        this.editMode = params['id'] != null;
        this.initForm();
      }
    )
  }

  onSubmit() {
    if (this.editMode) {
      // this.recipeService.updateRecipe(this.id, this.recipeForm.value);
      this.store.dispatch(new RecipesActions.UpdateRecipe({index: this.id, newRecipe: this.recipeForm.value}));
    } else {
      // this.recipeService.addRecipe(this.recipeForm.value);
      this.store.dispatch(new RecipesActions.AddRecipe(this.recipeForm.value));
    }
    this.onCancelClick();
  }

  onAddIngredient() {
    (<FormArray>this.recipeForm.get('ingredients')).push(
      new FormGroup({
        'name': new FormControl(null, Validators.required),
        'amount': new FormControl(null, Validators.required)
      })
    )
  }

  //If you hit cancel can you load the form with all the previous information
  onCancelClick() {
    // this.router.navigate([`recipes/${this.id}`]);
    this.router.navigate(['../'], {relativeTo: this.route});
    // let recipe = this.recipeService.getRecipe(this.id);
    // this.recipeForm = new FormGroup({
    //   'name': new FormControl(recipe.name, Validators.required),
    //   'imagePath': new FormControl(recipe.imagePath, Validators.required),
    //   'description': new FormControl(recipe.description, Validators.required),
    // 'ingredients': new FormArray(recipe.ingredients)
    // })
  }

  onDeleteIngredient(index: number) {
    (<FormArray>this.recipeForm.get('ingredients')).removeAt(index);
    // (<FormArray>this.recipeForm.get('ingredients')).clear();
  }

  ngOnDestroy(): void {
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }

  }

  private initForm() {
    let recipeName = '';
    let recipeImagePath = '';
    let recipeDescription = '';
    let recipeIngredients = new FormArray([]);

    if (this.editMode) {
      // const recipe = this.recipeService.getRecipe(this.id);
      this.storeSub = this.store.select('recipes').pipe(map(recipeState => {
        return recipeState.recipes.find((recipes, index) => {
          return index === this.id;
        })
      })).subscribe(recipe => {
        recipeName = recipe.name;
        recipeImagePath = recipe.imagePath;
        recipeDescription = recipe.description;
        if (recipe['ingredients']) {
          for (let ingredient of recipe.ingredients) {
            recipeIngredients.push(
              new FormGroup({
                'name': new FormControl(ingredient.name, Validators.required),
                'amount': new FormControl(ingredient.amount,
                  [
                    Validators.required,
                    Validators.pattern(/^[1-9]+[0-9]*$/)
                  ])
              })
            )
          }
        }

      })

    }
    this.recipeForm = new FormGroup({
      'name': new FormControl(recipeName, Validators.required),
      'imagePath': new FormControl(recipeImagePath, Validators.required),
      'description': new FormControl(recipeDescription, Validators.required),
      'ingredients': recipeIngredients
    })
  }
}
