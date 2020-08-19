import { Injectable } from "@angular/core";
import Swal from "sweetalert2";
@Injectable({
  providedIn: "root",
})
export class MessageService {
  constructor() {}
  //==============================
  // all alert
  //==============================
  showAlert(response: string, errorTitle: string, text?: string) {
    switch (response) {
      case "success":
        Swal.fire({
          customClass: {
            container: "success-class",
          },
          imageUrl: "../assets/img/anchal-logo.webp",
          imageWidth: 90,
          imageHeight: 90,
          icon: "success",
          title: errorTitle,
          text: text,
          showConfirmButton: true,
          allowOutsideClick: false,
          // timer: 2500,
        });
        break;
      case "error":
        Swal.fire({
          customClass: {
            container: "error-class",
          },
          imageUrl: "../assets/img/anchal-logo.webp",
          imageWidth: 90,
          imageHeight: 90,
          title: errorTitle,
          text: text,
          allowOutsideClick: false,
        });
        break;
      case "info":
        Swal.fire({
          customClass: {
            container: "warning-class",
          },
          imageUrl: "../assets/img/anchal-logo.webp",
          imageWidth: 90,
          imageHeight: 90,
          // icon: "info",
          title: errorTitle,
          text: text,
          showConfirmButton: true,
          allowOutsideClick: false,
        });
        break;
      default:
        break;
    }
  }
  //==================================
  // all text message
  //=================================
  err_message(textId) {
    if (textId === 1) {
      this.showAlert(
        "error",
        "Sorry! some problem occured",
        "Please check your connection or try again"
      );
    }
  }
}
