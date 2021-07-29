import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from './app.component';
import {HeaderComponent} from './header/header.component';
import {AppRoutingModule} from "./app-routing.module";
import { HttpClientModule} from "@angular/common/http";
import {ShoppingListModule} from "./shoppingList/shopping-list.module";
import {RecipesModule} from "./recipes/recipes.module";
import {SharedModule} from "./shared/shared.module";
import {CoreModule} from './core.module';
import { AuthModule } from './auth/auth.module';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, RecipesModule, ShoppingListModule, SharedModule, CoreModule, AuthModule],
  bootstrap: [AppComponent],
})
export class AppModule {
}
