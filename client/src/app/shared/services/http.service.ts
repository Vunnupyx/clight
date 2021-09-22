import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { AuthService } from './auth.service';
import { HttpHeaders, HttpParams, HttpClient } from '@angular/common/http';

const OPTIONS_DEFAULTS = { withCredentials: true };

export type RequestHttpHeaders = HttpHeaders | {
    [header: string]: string | string[];
};

export type RequestHttpParams = HttpParams | {
    [param: string]: string | string[];
};

export interface RequestOptionsArgs {
    headers?: RequestHttpHeaders;
    params?: RequestHttpParams;
    withCredentials?: boolean;
    responseType: string;
}

@Injectable()
export class HttpService {

    constructor(
        protected http: HttpClient,
        private authService: AuthService,
    ) { }

    get<T = any>(url: string, options?: RequestOptionsArgs) {
        return this.http.get<T>(this._getUrl(url), this._getOptions(options)).toPromise();
    }

    patch<T = any>(url: string, body: any, options?: RequestOptionsArgs) {
        return this.http.patch<T>(this._getUrl(url), body, this._getOptions(options)).toPromise();
    }

    put<T = any>(url: string, body: any, options?: RequestOptionsArgs) {
        return this.http.put<T>(this._getUrl(url), body, this._getOptions(options)).toPromise();
    }

    post<T = any>(url: string, body: any, options?: RequestOptionsArgs) {
        return this.http.post<T>(this._getUrl(url), body, this._getOptions(options)).toPromise();
    }

    delete(url: string, options?: RequestOptionsArgs) {
        return this.http.delete(this._getUrl(url), this._getOptions(options)).toPromise();
    }

    protected _getUrl(url: string) {
        return `${environment.apiRoot}${url}`;
    }

    protected _getOptions(customOptions: RequestOptionsArgs = {} as RequestOptionsArgs) {
        const options = Object.assign({}, OPTIONS_DEFAULTS, customOptions);

        if (this.authService.token) {
            options.headers = this._setAuthHeaders(options.headers as RequestHttpHeaders, this.authService.token);
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
        if (typeof existingHeaders.append === 'function') {
            existingHeaders.append('Authorization', token);
            return existingHeaders;
        }
        return {
            ...existingHeaders,
            Authorization: token,
        };
    }

}


