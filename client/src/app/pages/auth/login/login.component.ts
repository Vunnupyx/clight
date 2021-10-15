import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { AuthService } from '../../../shared';
import { LoginRequest } from "../../../models/auth";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  data: LoginRequest = {
    userName: '',
    password: '',
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {
  }

  onSubmit() {
    return this.auth.login(this.data)
      .then(() => this.router.navigate(['/']))
      .catch((error) => this.toastr.error(error.error.message));
  }
}
