import {Subscription} from 'rxjs';
import {Component, OnDestroy, OnInit,} from '@angular/core';
import {AuthService} from '../auth/auth.service';
import {DataStorageService} from '../shared/data-storage-service';
import {Store} from "@ngrx/store";
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import {map} from "rxjs/operators";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userSub = this.store.select('auth')
      .pipe(map(authState => authState.user))
      .subscribe((user) => {
        // this.isAuthenticated = !user ? false : true;
        // console.log('This is user: ', user);
        this.isAuthenticated = !!user;
        // console.log('This is !user: ', !user);
        // console.log('This is !!user: ', !!user);
      });
  }

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }

  onFetchData() {
    this.dataStorageService.fetchRecipes().subscribe();
  }

  onLogout() {
    this.store.dispatch(new AuthActions.Logout());
  }
}
