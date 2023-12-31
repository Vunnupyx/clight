import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import {
  HttpHeaders,
  HttpParams,
  HttpClient,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { EMPTY } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

const OPTIONS_DEFAULTS = {
  withCredentials: true,
  headers: new HttpHeaders() as RequestHttpHeaders
};

export type RequestHttpHeaders =
  | HttpHeaders
  | {
      [header: string]: string | string[];
    };

export type RequestHttpParams =
  | HttpParams
  | {
      [param: string]: string | string[];
    };

export interface RequestOptionsArgs {
  headers?: RequestHttpHeaders;
  params?: RequestHttpParams;
  withCredentials?: boolean;
  responseType?: string;
  observe?: string;
  reportProgress?: boolean;
}

@Injectable()
export class HttpService {
  constructor(
    protected http: HttpClient,
    private router: Router,
    private authService: AuthService,
    private translate: TranslateService,
    private toastr: ToastrService
  ) {}

  get<T = any>(
    url: string,
    options?: RequestOptionsArgs,
    suppressErrorNotification?: boolean
  ) {
    return this.http
      .get<T>(this._getUrl(url), this._getOptions(options))
      .pipe(
        catchError((err) => !suppressErrorNotification && this._catchError(err))
      )
      .toPromise();
    // .catch((err) => this._catchError(err));
  }

  patch<T = any>(url: string, body: any, options?: RequestOptionsArgs) {
    return (
      this.http
        .patch<T>(this._getUrl(url), body, this._getOptions(options))
        // .pipe(catchError((err, caught) => this._catchError(err, caught)))
        .toPromise()
    );
  }

  put<T = any>(url: string, body: any, options?: RequestOptionsArgs) {
    return (
      this.http
        .put<T>(this._getUrl(url), body, this._getOptions(options))
        // .pipe(catchError((err, caught) => this._catchError(err, caught)))
        .toPromise()
    );
  }

  post<T = any>(url: string, body: any, options?: RequestOptionsArgs) {
    return (
      this.http
        .post<T>(this._getUrl(url), body, this._getOptions(options))
        // .pipe(catchError((err, caught) => this._catchError(err, caught)))
        .toPromise()
    );
  }

  delete(url: string, options?: RequestOptionsArgs) {
    return (
      this.http
        .delete(this._getUrl(url), this._getOptions(options))
        // .pipe(catchError((err, caught) => this._catchError(err, caught)))
        .toPromise()
    );
  }

  download<T = any>(url: string, options?: RequestOptionsArgs) {
    return this.http
      .get<T>(this._getUrl(url), this._getOptions(options))
      .pipe(catchError((err) => this._catchError(err)));
  }

  protected _getUrl(url: string) {
    return `${environment.apiRoot}${url}`;
  }

  protected _catchError(err: HttpErrorResponse) {
    if (err.status === 401) {
      this.authService.logout();
      this.toastr.error(this.translate.instant('http.SessionExpired'));
      return EMPTY;
    }

    if (err.status === 403 && this.authService.token) {
      this.router.navigate(['/reset-password']);
      return EMPTY;
    }

    if (err.status === 504 && this.authService.token) {
      this.toastr.error(
        this.translate.instant('http.RuntimeError'),
        undefined,
        { timeOut: 30000 }
      );
    }

    throw err;
  }

  protected _getOptions(
    customOptions: RequestOptionsArgs = {} as RequestOptionsArgs
  ) {
    const options = Object.assign({}, OPTIONS_DEFAULTS, customOptions);
    if (this.authService.token) {
      options.headers = this._setAuthHeaders(
        options.headers as RequestHttpHeaders,
        this.authService.token
      );
    }

    return options as {
      headers?: HttpHeaders;
      observe?: 'body';
      params?: HttpParams;
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
    };
  }

  private _setAuthHeaders(existingHeaders: RequestHttpHeaders, token: string) {
    if (typeof existingHeaders.set === 'function') {
      existingHeaders = existingHeaders.set('Authorization', `Bearer ${token}`);

      return existingHeaders;
    }
    return {
      ...existingHeaders,
      Authorization: `Bearer ${token}`
    };
  }
}
