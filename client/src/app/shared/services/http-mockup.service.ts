import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { RequestOptionsArgs, HttpService } from './http.service';
import { errorMockup, sleep } from 'app/shared/utils';
import { AuthService } from './auth.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

const SLEEP_INTERVAL_MS = 250;

@Injectable()
export class HttpMockupService extends HttpService {
  constructor(
    http: HttpClient,
    router: Router,
    authService: AuthService,
    translate: TranslateService,
    toastr: ToastrService
  ) {
    super(http, router, authService, translate, toastr);
  }

  async get<T = any>(url: string, options?: RequestOptionsArgs, mockup?: T) {
    try {
      return await super.get(url, options);
    } catch (err) {
      await sleep(SLEEP_INTERVAL_MS);
      errorMockup(err, mockup);
      return mockup;
    }
  }

  async patch<T = any>(
    url: string,
    body,
    options?: RequestOptionsArgs,
    mockup?: T
  ) {
    try {
      return await super.patch(url, body, options);
    } catch (err) {
      await sleep(SLEEP_INTERVAL_MS);
      errorMockup(err, mockup);
      return mockup;
    }
  }

  async put<T = any>(
    url: string,
    body,
    options?: RequestOptionsArgs,
    mockup?: T
  ) {
    try {
      return await super.put(url, body, options);
    } catch (err) {
      await sleep(SLEEP_INTERVAL_MS);
      errorMockup(err, mockup);
      return mockup;
    }
  }

  async post<T = any>(
    url: string,
    body,
    options?: RequestOptionsArgs,
    mockup?: T
  ) {
    try {
      return await super.post(url, body, options);
    } catch (err) {
      await sleep(SLEEP_INTERVAL_MS);
      errorMockup(err, mockup);
      return mockup;
    }
  }

  async delete(url, options?: RequestOptionsArgs, mockup?) {
    try {
      return await super.delete(url, options);
    } catch (err) {
      await sleep(SLEEP_INTERVAL_MS);
      errorMockup(err, mockup);
      return mockup;
    }
  }
}
