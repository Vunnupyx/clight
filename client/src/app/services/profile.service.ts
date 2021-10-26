import { Injectable } from '@angular/core';

import { ChangePasswordRequest } from '../models/auth';
import {HttpService} from "../shared";


@Injectable()
export class ProfileService {

  constructor(private httpService: HttpService) {}

  changePassword(data: ChangePasswordRequest) {
    return this.httpService.post('/auth/change-password', data);
  }
}
