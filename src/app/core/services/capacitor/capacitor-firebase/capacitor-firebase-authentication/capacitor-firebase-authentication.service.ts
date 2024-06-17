import { Injectable, NgZone } from '@angular/core';
import {
  AuthStateChange,
  ConfirmPasswordResetOptions,
  CreateUserWithEmailAndPasswordOptions,
  FirebaseAuthentication,
  GetCurrentUserResult,
  GetIdTokenOptions,
  GetIdTokenResult,
  LinkResult,
  LinkWithEmailAndPasswordOptions,
  SendPasswordResetEmailOptions,
  SignInResult,
  SignInWithEmailAndPasswordOptions,
  SignInWithOAuthOptions,
  UnlinkOptions,
  UnlinkResult,
  UpdateEmailOptions,
  UpdatePasswordOptions,
  UpdateProfileOptions,
} from '@capacitor-firebase/authentication';
import { Capacitor } from '@capacitor/core';
import {
  getAuth,
  indexedDBLocalPersistence,
  setPersistence,
} from 'firebase/auth';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CapacitorFirebaseAuthenticationService {
  private authStateChangeSubject = new ReplaySubject<AuthStateChange>();

  constructor(private readonly ngZone: NgZone) {
    void this.setPersistence();
    void this.addListeners();
  }

  public get authStateChange$(): Observable<AuthStateChange> {
    return this.authStateChangeSubject.asObservable();
  }

  public confirmPasswordReset(
    options: ConfirmPasswordResetOptions,
  ): Promise<void> {
    return FirebaseAuthentication.confirmPasswordReset(options);
  }

  public createUserWithEmailAndPassword(
    options: CreateUserWithEmailAndPasswordOptions,
  ): Promise<SignInResult> {
    return FirebaseAuthentication.createUserWithEmailAndPassword(options);
  }

  public getCurrentUser(): Promise<GetCurrentUserResult> {
    return FirebaseAuthentication.getCurrentUser();
  }

  public getIdToken(options?: GetIdTokenOptions): Promise<GetIdTokenResult> {
    return FirebaseAuthentication.getIdToken(options);
  }

  public getRedirectResult(): Promise<SignInResult> {
    return FirebaseAuthentication.getRedirectResult();
  }

  public sendEmailVerification(): Promise<void> {
    return FirebaseAuthentication.sendEmailVerification();
  }

  public sendPasswordResetEmail(
    options: SendPasswordResetEmailOptions,
  ): Promise<void> {
    return FirebaseAuthentication.sendPasswordResetEmail(options);
  }

  public signInAnonymously(): Promise<SignInResult> {
    return FirebaseAuthentication.signInAnonymously();
  }

  public signInWithApple(
    options?: SignInWithOAuthOptions,
  ): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithApple(options);
  }

  public signInWithEmailAndPassword(
    options: SignInWithEmailAndPasswordOptions,
  ): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithEmailAndPassword(options);
  }

  public signInWithGoogle(
    options?: SignInWithOAuthOptions,
  ): Promise<SignInResult> {
    return FirebaseAuthentication.signInWithGoogle(options);
  }

  public linkWithEmailAndPassword(
    options: LinkWithEmailAndPasswordOptions,
  ): Promise<LinkResult> {
    return FirebaseAuthentication.linkWithEmailAndPassword(options);
  }

  public linkWithApple(): Promise<LinkResult> {
    return FirebaseAuthentication.linkWithApple();
  }

  public linkWithGoogle(): Promise<LinkResult> {
    return FirebaseAuthentication.linkWithGoogle();
  }

  public signOut(): Promise<void> {
    return FirebaseAuthentication.signOut();
  }

  public removeAllListeners(): Promise<void> {
    return FirebaseAuthentication.removeAllListeners();
  }

  public updateProfile(options: UpdateProfileOptions): Promise<void> {
    return FirebaseAuthentication.updateProfile(options);
  }

  public updateEmail(options: UpdateEmailOptions): Promise<void> {
    return FirebaseAuthentication.updateEmail(options);
  }

  public updatePassword(options: UpdatePasswordOptions): Promise<void> {
    return FirebaseAuthentication.updatePassword(options);
  }

  public deleteUser(): Promise<void> {
    return FirebaseAuthentication.deleteUser();
  }

  public unlink(options: UnlinkOptions): Promise<UnlinkResult> {
    return FirebaseAuthentication.unlink(options);
  }

  private async setPersistence(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      return;
    }
    // Persists the user's session so that the user
    // is still logged in after a page reload.
    await setPersistence(getAuth(), indexedDBLocalPersistence);
  }

  private async addListeners(): Promise<void> {
    if (Capacitor.isNativePlatform()) {
      await this.removeAllListeners();
      // This fires every time the auth state changes
      // and once after the (native) listener is added.
      await FirebaseAuthentication.addListener('authStateChange', event => {
        this.ngZone.run(() => {
          this.authStateChangeSubject.next(event);
        });
      });
      // When using live reload, the auth state change
      // listener is not added again after a page reload.
      await this.getCurrentUser().then(result => {
        this.authStateChangeSubject.next({ user: result.user });
      });
    } else {
      // See https://github.com/capawesome-team/capacitor-firebase/issues/494
      const auth = getAuth();
      auth.onAuthStateChanged(() => {
        void this.getCurrentUser().then(result => {
          this.authStateChangeSubject.next({ user: result.user });
        });
      });
    }
  }
}
