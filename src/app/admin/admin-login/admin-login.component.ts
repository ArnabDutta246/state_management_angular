import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { AdminLoginService } from "../auth/admin-login.service";
import Swal from "sweetalert2";
@Component({
  selector: "app-admin-login",
  templateUrl: "./admin-login.component.html",
  styleUrls: ["./admin-login.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class AdminLoginComponent implements OnInit {
  loginForm: FormGroup;
  constructor(
    private loginService: AdminLoginService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    //-------------------- form builder & validation--------------
    this.loginForm = this.formBuilder.group(
      {
        id: ["", [Validators.required]],
        email: ["", [Validators.required]],
        password: ["", [Validators.required]],
      },
      {
        validator: [],
      }
    );
  }
  //------------
  // get form data
  get f() {
    return this.loginForm.controls;
  }
  //------------------- submit the registration data ----------------
  async onSubmit() {
    if (this.loginForm.invalid) {
      this.loginService.showAlert(
        "error",
        "Some of your information may be missing or invalid. Please check",
        "Sorry!! Please check Again"
      );
    } else {
      console.log(this.loginForm.value);
      this.loginService.signIn(this.loginForm.value);
    }
  }
}
