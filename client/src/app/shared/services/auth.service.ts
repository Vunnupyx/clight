import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { LocalStorageService } from './local-storage.service';
import { ForgotPasswordRequest, LoginRequest, LoginResponse, ResetPasswordRequest } from "../../models/auth";
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {

  private _token$ = new BehaviorSubject<string>(null as any);

  get token$() { return this._token$.asObservable(); }

  constructor(
    private localStorageService: LocalStorageService,
    private http: HttpClient,
    private router: Router
  ) {}

  get token() {
    return this.localStorageService.get<string>('accessToken');
  }

  login(data: LoginRequest) {
    return this.http.post<LoginResponse>(`${environment.apiRoot}/auth/login`, data)
      .toPromise()
      .then((response) => {
        this.localStorageService.set('accessToken', response.accessToken);
        this._token$.next(response.accessToken);
        return response;
      });
  }

  sendResetToken(data: ForgotPasswordRequest) {
    return this.http.post(`${environment.apiRoot}/auth/forgot-password`, data)
      .toPromise();
  }

  verifyResetToken(token: string) {
    return this.http.post(`${environment.apiRoot}/auth/forgot-password/verify`, { token })
      .toPromise();
  }

  resetPassword(data: ResetPasswordRequest) {
    return this.http.post(`${environment.apiRoot}/auth/reset-password`, data)
      .toPromise();
  }

  logout() {
    this.localStorageService.clear('accessToken');
    this._token$.next(null as any);
    return this.router.navigate(['/login']);
  }
}
