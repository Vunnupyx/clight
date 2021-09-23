import { Injectable } from '@angular/core';

import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthService {
  constructor(private localStorageService: LocalStorageService) {}

  get token() {
    return this.localStorageService.get<string>('token');
  }
}
