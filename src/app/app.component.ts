import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'recipe-project';
  showRecipe: boolean = false;
  showShoppingList: boolean = false;
  loadedFeature = 'recipe';

  selectFeature(feature: string) {
    this.loadedFeature = feature;
  }
}
