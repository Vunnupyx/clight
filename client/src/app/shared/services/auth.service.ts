import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { LocalStorageService } from './local-storage.service';
import { LoginRequest, LoginResponse } from "../../models/auth";
import { environment } from 'environments/environment';

@Injectable()
export class AuthService {
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

        return response;
      });
  }

  logout() {
    this.localStorageService.clear('accessToken');
    return this.router.navigate(['/auth/login']);
  }
}
