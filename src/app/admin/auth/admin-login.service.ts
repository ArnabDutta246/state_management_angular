import { Injectable } from "@angular/core";
import Swal from "sweetalert2";
import * as CryptoJS from "crypto-js";
import { environment } from "src/environments/environment.prod";
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from "@angular/router";
import { AngularFirestore } from "@angular/fire/firestore";
import { ToastrService } from "ngx-toastr";
@Injectable({
  providedIn: "root",
})
export class AdminLoginService {
  orderCollection: string = "orders";
  adminData: any = null;
  orgKey: string = environment.orgkey;
  constructor(
    public afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private router: Router,
    private toastr: ToastrService
  ) {}
  //-------------------auth guard for all org admin-------------
  isAd() {
    let resolve;
    return new Promise((result, rej) => {
      if (sessionStorage.getItem("services") !== null) {
        let getUserData = this.returnSessionData();
        //console.log("after decy", getUserData);
        if (getUserData !== null) {
          let check = getUserData.serectKey === this.orgKey ? true : false;
          result(check);
        } else {
          result(false);
        }
      } else {
        sessionStorage.clear();
        result(false);
      }
      // });
    });
  }
  //------------------ store data in sessionStorage --------------------
  storeInLocalStorage(data: any) {
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(data),
      environment.serectkey
    ).toString();
    sessionStorage.setItem("services", ciphertext);
  }
  //------------------ return stored data ----------------------
  returnSessionData() {
    if (sessionStorage.getItem("services") !== null) {
      //-->decrytion of session data
      const data = sessionStorage.getItem("services");
      var bytes = CryptoJS.AES.decrypt(data, environment.serectkey);
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      this.adminData = decryptedData;
      return this.adminData;
    }
  }
  //------------------ logout function --------------------
  public logout() {
    sessionStorage.clear();
    return this.afAuth.auth.signOut().then(() => {
      this.router.navigate(["/"]);
    });
  }
  //-------------------- sign in function ----------------------
  public signIn(frm) {
    let use;
    let newUser = frm;
    return this.afAuth.auth
      .signInWithEmailAndPassword(newUser.email, newUser.password)
      .then((userCredetial) => {
        if (userCredetial) {
          let use = userCredetial;
          console.log(userCredetial.user.uid);
          return this.checkAdminOrg(newUser, userCredetial.user.uid).then(
            (res) => {
              if (res == true) {
                this.checkAdmin();
              } else {
                this.showAlert(
                  "error",
                  "Please try again",
                  "Something missing"
                );
                return false;
              }
            }
          );
        }
      })
      .catch((err) => {
        console.log(err);
        this.showAlert("error", "Please try again", "Something missing");
        return false;
      });
  }
  //--------------------check admin org------------
  private checkAdminOrg(newUser, userUid: string) {
    return new Promise((res, rej) => {
      return this.afs
        .collection("admin")
        .doc(userUid)
        .get()
        .toPromise()
        .then(
          function (result) {
            if (result.exists) {
              this.adminData = result.data();
              console.log(this.adminData);
              return res(newUser.id === this.orgKey ? true : false);
            }
            return res(false);
          }.bind(this)
        );
    });
  }
  //------------- checkAdmin ---------------------------------
  private checkAdmin() {
    this.storeInLocalStorage(this.adminData);
    this.router.navigate(["anchal-web-management"]);
  }
  //==============================
  // all alert
  //==============================
  showAlert(response: string, text: string, errorTitle?: string) {
    switch (response) {
      case "success":
        Swal.fire({
          imageUrl: "../assets/img/anchal-logo.webp",
          imageWidth: 120,
          imageHeight: 120,
          // icon: "success",
          title: errorTitle,
          text: text,
          showConfirmButton: true,
          allowOutsideClick: false,
          // timer: 2500,
        });
        break;
      case "error":
        Swal.fire({
          imageUrl: "../assets/img/anchal-logo.webp",
          imageWidth: 120,
          imageHeight: 120,
          // icon: "error",
          title: errorTitle,
          text: text,
          allowOutsideClick: false,
        });
        break;
      case "info":
        Swal.fire({
          imageUrl: "../assets/img/anchal-logo.webp",
          imageWidth: 120,
          imageHeight: 120,
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
  // returnUpdateRes(){
  // Swal.fire({
  //   title: "Some new features Updated",
  //   // text: "",
  //   // icon: "",
  //   showConfirmButton: true,
  //   allowOutsideClick: false,
  // }).then((willDelete) => {
  //   if (willDelete) {
  //   }
  // });
  // }

  //=================================
  // toaster functions
  //================================
  showSuccess(msg) {
    this.toastr.success(msg);
  }
  showWarning(msg) {
    this.toastr.warning(msg);
  }
}
