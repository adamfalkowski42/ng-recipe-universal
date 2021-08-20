import {Actions, Effect, ofType} from '@ngrx/effects'
import * as AuthActions from './auth.actions'
import {catchError, map, switchMap, tap} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {of} from "rxjs";
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
  return new AuthActions.AuthenticateSuccess({email, userId, token, expirationDate});
};

const handleError = (errorRes: any) => {
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
}


@Injectable()
export class AuthEffects {
  @Effect()
  authSignup = this.actions$.pipe(
    ofType(AuthActions.SIGNUP_START),
    switchMap((signupAction: AuthActions.SignupStart) => {
      console.log('gets here');
        return this.http
          .post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=' + environment.API_KEY,
            {
              email: signupAction.payload.email,
              password: signupAction.payload.password,
              returnSecureToken: true,
            }
          ).pipe(
            map(resData => {

              return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
            }),
            catchError(errorRes => {
              return handleError(errorRes);
            })
          );
      }
    ));
  @Effect()
  authLogin = this.actions$.pipe(
    ofType(AuthActions.LOGIN_START),
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
            console.log('This is resData: ');
            console.log(resData.email);
            console.log(resData.localId);
            console.log(resData.idToken);
            return handleAuthentication(+resData.expiresIn, resData.email, resData.localId, resData.idToken);
          }),
          catchError(errorRes => {
            return handleError(errorRes);
          })
        );
    })
  );

  // authSuccess = createEffect(
  //   ()=> this.actions$.pipe(ofType(AuthActions.authenticateSuccess),
  //     tap(action =>action.redirect && this.router.navigate(['/']))),{dispatch:false}
  // );
  @Effect({dispatch: false})
  authSuccess = this.actions$.pipe(ofType(AuthActions.AUTHENTICATE_SUCCESS), tap(() => {
    this.router.navigate(['/'])
  }));
  @Effect({dispatch: false})
  authLogout = this.actions$.pipe(ofType(AuthActions.LOGOUT),
    tap(()=>{
      localStorage.removeItem('userData');
    }))

  @Effect()
  autoLogin = this.actions$.pipe(ofType(AuthActions.AUTO_LOGIN),
    map(()=>{
      const userData: {
        email: string,
        id: string,
        _token: string,
        _tokenExpirationDate: string
      } = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return { type: 'DUMMY'};
      }
      const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
      if (loadedUser.token) {
        // this.user.next(loadedUser);
        return new AuthActions.AuthenticateSuccess({
            email: loadedUser.email,
            userId: loadedUser.id,
            token: loadedUser.token,
            expirationDate: new Date(userData._tokenExpirationDate)
          })
        // const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        // this.autoLogout(expirationDuration);
      }
      return {type: 'DUMMY'};
    })
    )

  constructor(private actions$: Actions, private http: HttpClient, private router: Router) {
  }
}



