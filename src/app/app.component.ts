import { Component } from "@angular/core";
import { SwUpdate } from "@angular/service-worker";
import Swal from "sweetalert2";
import { Router, NavigationEnd } from "@angular/router";

// declare ga as a function to access the JS code in TS
declare let ga: Function;
@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent {
  //=============================================
  constructor(private swUpdate: SwUpdate, private router: Router) {
    //====================check new update service=============
    // if (this.swUpdate.isEnabled) {
    //   this.swUpdate.available.subscribe(() => {
    //     Swal.fire({
    //       imageUrl: "../assets/img/anchal-logo.webp",
    //       imageWidth: 120,
    //       imageHeight: 120,
    //       title:
    //         "Welcome to Anchal website. Some new features Updated. Please reload this page",
    //       // text: "",
    //       // icon: "",
    //       showConfirmButton: true,
    //       confirmButtonText: "Reload",
    //       allowOutsideClick: false,
    //     }).then((willDelete) => {
    //       if (willDelete) {
    //         window.location.reload();
    //         sessionStorage.clear();
    //       } else {
    //         window.location.reload();
    //         sessionStorage.clear();
    //       }
    //     });
    //   });
    // }
    //=============google analytics=======================
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     ga("set", "page", event.urlAfterRedirects);
    //     ga("send", "pageview");
    //   }
    // });
  }
}
