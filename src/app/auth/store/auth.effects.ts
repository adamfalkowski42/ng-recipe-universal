import {Actions, createEffect, Effect, ofType} from '@ngrx/effects'
import * as AuthActions from './auth.actions'
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {of, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {User} from "../user.model";
import {Router} from "@angular/router";

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}


const handleAuthentication = (
  expiresIn: number,
  email: string,
  userId: string,
  token: string
) => {
  const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
  const user = new User(email, userId, token, expirationDate);
  localStorage.setItem('userData', JSON.stringify(user));
  return AuthActions.authenticateSuccess({email, userId, token, expirationDate, redirect: true});
};

@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart)=>{
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.API_KEY,
          {
            email: signupAction.payload.email,
            password: signupAction.payload.password,
            returnSecureToken: true,
          }
        )
    }
  ));
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.AUTHENTICATE_SUCCESS),
    switchMap((authData: AuthActions.LoginStart) => {
      return this.http
        .post<AuthResponseData>(
          'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + environment.API_KEY,
          {
            email: authData.payload.email,
            password: authData.payload.password,
            returnSecureToken: true,
          }
        ).pipe(
          map(resData => {
            const expirationDate = new Date(new Date().getTime() + +resData.expiresIn * 1000);
            return new AuthActions.AuthenticateSuccess({
              email: resData.email,
              userId: resData.localId,
              token: resData.idToken,
              expirationDate: expirationDate
            });
          }),
          catchError(errorRes => {
            let errorMessage = 'Unknown error occurred!';
            if (!errorRes.error || !errorRes.error.error) {
              return of(new AuthActions.AuthenticateFail(errorMessage))
            }
              switch (errorRes.error.error.message) {
                case 'EMAIL_EXISTS': {
                  errorMessage = 'This email already exists!';
                  break;
                }
                case 'OPERATION_NOT_ALLOWED': {
                  errorMessage = 'This password sign in is disabled for this web site';
                  break;
                }
                case 'TOO_MANY_ATTEMPTS_TRY_LATER': {
                  errorMessage = 'Too many attempts have been tried on this account';
                  break;
                }
                case 'EMAIL_NOT_FOUND': {
                  errorMessage = 'Email not found. Please try to signup first!';
                  break;
                }

                case 'INVALID_PASSWORD':
                  errorMessage = 'This password is not correct';
                  break;
              }
            return of(new AuthActions.AuthenticateFail(errorMessage));
          })
        );
      })
  );

  // authSuccess = createEffect(
  //   ()=> this.actions$.pipe(ofType(AuthActions.authenticateSuccess),
  //     tap(action =>action.redirect && this.router.navigate(['/']))),{dispatch:false}
  // );
  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS),tap(()=>{
    this.router.navigate(['/'])
  }))

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {
  }
}



