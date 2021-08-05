import {NgModule} from "@angular/core";
import {ShoppingListComponent} from "./shopping-list/shopping-list.component";
import {ShoppingEditComponent} from "./shopping-list/shopping-edit/shopping-edit.component";
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../shared/shared.module";
import {ShoppingListRoutingModule} from "./shopping-list-routing.module";
import { LoggingService } from "../logging.service";


@NgModule({
  declarations:[ShoppingListComponent,
    ShoppingEditComponent],
  imports:[RouterModule,ReactiveFormsModule,FormsModule, SharedModule,ShoppingListRoutingModule],
  // providers: [LoggingService]
})
export class ShoppingListModule{}
