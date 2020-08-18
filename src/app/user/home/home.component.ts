import {
  Component,
  ViewChild,
  ElementRef,
  OnInit,
  AfterViewInit,
} from "@angular/core";
import { allProducts } from "src/products/allProducts";
import * as CryptoJS from "crypto-js";
import { Subscription } from "rxjs";
import { NavigationStart, Router } from "@angular/router";
import { ConnectionService } from "ng-connection-service";
//import { IndexedDBService } from "../../services/indexed-db.service";
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { FacebookService, InitParams } from "ngx-facebook";
//import { OwlOptions } from "ngx-owl-carousel-o";
import { environment } from "src/environments/environment.prod";
import { AdminLoginService } from "src/app/admin/auth/admin-login.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit, AfterViewInit {
  @ViewChild("modalCloseButton", { static: false })
  modalCloseButton: ElementRef;
  @ViewChild("goToOrder", { static: false }) goToOrder: ElementRef;
  @ViewChild("backToCart", { static: false })
  backToCart: ElementRef;
  title = "anchalbd";
  products: any = [];
  data: any = null;
  cart: any[] = [];
  subTotal: number = 0;
  subscription: Subscription;
  ig: any = [];
  deliveryCharge: number = 0;
  cartState: boolean = true;
  orderForm: FormGroup;
  submitted: boolean = false;
  msgLoaded: boolean = false;
  isLoading: boolean;
  status: any = "ONLINE"; //initializing as online by default
  isConnected: any = true;
  //=============================================
  constructor(
    private router: Router,
    //private idb: IndexedDBService,
    private formBuilder: FormBuilder,
    private facebookService: FacebookService,
    private loginService: AdminLoginService,
    private connectionService: ConnectionService
  ) {
    this.connectionService.monitor().subscribe((isConnected) => {
      this.isConnected = isConnected;
      if (this.isConnected) {
        this.status = "ONLINE";
      } else {
        this.status = "OFFLINE";
        this.loginService.showAlert(
          "error",
          "Your network is too poor or currently you are in offline.",
          "Please check your internet"
        );
      }
    });
    //=======================
    this.isLoading = true;
    this.products = allProducts;
    this.stateAllProduct();
    //==========================
    // detect page load
    //==========================
    this.subscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        let browserRefresh = !router.navigated;
        if (browserRefresh) this.returnSessionData();
      }
    });
    //-------------------- form builder & validation--------------
    let pattern = /[a-zA-Z][a-zA-Z\s]*/;
    this.orderForm = this.formBuilder.group(
      {
        name: [
          "",
          [
            Validators.required,
            Validators.minLength(3),
            Validators.pattern(pattern),
          ],
        ],
        phone: ["", [Validators.required, Validators.maxLength(11)]],
        address: ["", [Validators.required, Validators.pattern(pattern)]],
      },
      {
        validator: [],
      }
    );
  }
  //------------
  // get form data
  get f() {
    return this.orderForm.controls;
  }
  ngOnInit(): void {
    this.initFacebookService();
    this.returnSessionData();
  }
  ngAfterViewInit() {
    setTimeout(() => {
      this.isLoading = false;
      if (this.isLoading === false) {
        let ifr = document.querySelector("iframe[data-testid='dialog_iframe']");
        // if (ifr.classList.contains("fb_customer_chat_bounce_in_v2")) {
        //   ifr.classList.remove("fb_customer_chat_bounce_in_v2");
        //   ifr.classList.add("fb_customer_chat_bounce_out_v2");
        // } else
        if (
          !ifr.classList.contains("fb_customer_chat_bounce_in_v2") ||
          !ifr.classList.contains("fb_customer_chat_bounce_out_v2")
        ) {
          ifr.classList.add("fb_customer_chat_bounce_out_v2");
        }
      }
    }, 5700);
  }
  private initFacebookService(): void {
    const initParams: InitParams = {
      appId: "2272769672978593",
      xfbml: true,
      version: "v7.0",
    };
    this.facebookService.init(initParams);
  }
  //------------------- submit the order data ----------------
  async onSubmit() {
    this.submitted = true;
    if (this.orderForm.invalid) {
      // console.log("Error occured");
      this.loginService.showAlert(
        "error",
        "Some of your information may be missing or invalid. Please check",
        "Sorry!! Please check Again"
      );
    } else {
      //console.log("Success");
      //console.log(this.orderForm.value);
      this.loginService.showAlert(
        "error",
        "Your order is placed successfully. We will contact with you as soon as possible. Thank you",
        "Successfuly placed order"
      );
      this.storeOrderData(this.orderForm.value);
    }
  }
  //================================================
  async stateAllProduct() {
    this.products = this.products.map(
      function (n) {
        n.state = false;
        return n;
      }.bind(this)
    );
  }

  //===============================
  // side bar open close
  //===============================
  openNav() {
    let sideDrawer = document.getElementById("side-drawer");
    sideDrawer.classList.contains("open")
      ? this.openClose(sideDrawer, "close", "open")
      : this.openClose(sideDrawer, "open", "close");
    if (!this.cartState) this.goToOrderF(2);
  }
  openClose = (sideDrawer, add, remove) => {
    sideDrawer.classList.remove(remove);
    sideDrawer.classList.add(add);
  };
  //================================
  // product details
  //================================
  productDetails(product: any) {
    this.data = product;
  }
  //================================
  // add to cart
  //================================
  addToCartOrRemove(pro: any) {
    let product = {
      id: pro.id,
      name: pro.name,
      price: pro.price,
      limit: pro.limit,
      need: 0,
      currPrice: 0,
      image: pro.image,
      displayPrice: pro.displayPrice,
      quantity: pro.quantity,
      displayLimit: pro.displayLimit,
      preOrderable: pro.preOrderable,
    };
    let index = this.cart.findIndex((n) => n.id === product.id);
    let productIndex = this.products.findIndex((n) => n.id === product.id);

    if (index === -1) {
      product.need = product.limit > 0 ? product.limit : 1;
      product.currPrice =
        product.limit > 0 ? product.price * product.limit : product.price;
      this.cart.push(product);
      this.products[productIndex].state = !this.products[productIndex].state;
      this.changeNeedAnsSubtotal(this.cart.length - 1, "add", 0);
      this.loginService.showSuccess("Item added in your cart");
    } else {
      this.products[productIndex].state = !this.products[productIndex].state;
      this.subTotal = this.subTotal - this.cart[index].currPrice;
      this.cart.splice(index, 1);
      this.storeInLocalStorage(this.cart);
      this.loginService.showWarning("Item removed from your cart");
    }
    this.updateDeliveryPrice();
  }
  //================================
  // update delivery price
  //================================
  updateDeliveryPrice() {
    this.deliveryCharge =
      this.cart.length === 0
        ? 0
        : this.cart.some((n) => n.preOrderable === false)
        ? 50
        : 0;
  }
  //================================
  // change sub total
  //================================
  changeNeedAnsSubtotal(index: number, action: string, updatedNeed: any = 0) {
    this.cart[index].need =
      updatedNeed !== 0 ? updatedNeed : this.cart[index].need;
    this.cart[index].currPrice = this.cart[index].price * this.cart[index].need;
    if (action === "add") {
      this.subTotal = this.subTotal + this.cart[index].currPrice;
    } else if (action === "update") {
      this.subTotal =
        this.subTotal +
        (this.cart[index].currPrice === this.cart[index].price
          ? this.cart[index].currPrice
          : this.cart[index].currPrice -
            this.cart[index].price * (this.cart[index].need - 1));
    } else {
      this.subTotal =
        this.subTotal -
        (this.cart[index].currPrice === this.cart[index].price
          ? this.cart[index].price
          : this.cart[index].currPrice -
            this.cart[index].price * (this.cart[index].need - 1));
    }
    this.storeInLocalStorage(this.cart);
  }
  //===============================
  // modal action
  //===============================
  modalAction() {
    let b: HTMLElement = this.modalCloseButton.nativeElement as HTMLElement;
    b.click();
    this.openNav();
  }
  //===============================
  // increase/decrease
  //===============================
  needIncDecs(product: any, type: string, i: number) {
    let data = document.querySelector(
      `#pruductCartNeed${i}`
    ) as HTMLInputElement;
    let need = parseInt(data.value);
    need = type === "delete" ? need - 1 : need + 1;
    if (product.limit > need || need === 0) {
      this.loginService.showAlert(
        "info",
        `N.B: Minimum ${
          product.limit === 0 ? 1 : product.limit
        } unit required.`,
        "Minimum Purchase!!"
      );
    } else {
      this.changeNeedAnsSubtotal(i, type, need);
    }
  }

  //------------------ store data in sessionStorage --------------------
  storeInLocalStorage(cart: any) {
    // Encrypt
    var ciphertext = CryptoJS.AES.encrypt(
      JSON.stringify(cart),
      environment.serectkey
    ).toString();
    sessionStorage.setItem("user", ciphertext);
  }
  //------------------ return stored data ----------------------
  returnSessionData() {
    if (sessionStorage.getItem("user") !== null) {
      //-->decrytion of session data
      const data = sessionStorage.getItem("user");
      var bytes = CryptoJS.AES.decrypt(data, environment.serectkey);
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      this.cart = decryptedData;
      console.log("the recent cart is", this.cart);
      // --> update
      let i = 0;
      this.products = allProducts;
      this.cart.map(
        function (n) {
          let a = this.products.findIndex((m) => m.id === n.id);
          this.products[a].state = true;
          n.name = this.products[a].name;
          n.price = this.products[a].price;
          n.limit = this.products[a].limit;
          n.image = this.products[a].image;
          n.displayPrice = this.products[a].displayPrice;
          n.quantity = this.products[a].quantity;
          n.displayLimit = this.products[a].displayLimit;
          this.changeNeedAnsSubtotal(i, "add", n.need);
          i++;
        }.bind(this)
      );
      this.updateDeliveryPrice();
    }
  }
  // ====================== panel control ================
  goToOrderF(id) {
    let b: HTMLElement =
      id === 1
        ? (this.goToOrder.nativeElement as HTMLElement)
        : (this.backToCart.nativeElement as HTMLElement);
    b.click();
    this.cartState = !this.cartState;
  }
  //===================== store order data ===============
  storeOrderData(frm) {
    if (this.status === "ONLINE") {
      let data = {
        name: frm.name,
        phone: frm.phone,
        address: frm.address,
        total: this.subTotal,
        delivery: this.deliveryCharge,
        products: this.cart,
        time: new Date(),
        status: "pending",
      };
      this.loginService.afs
        .collection(this.loginService.orderCollection)
        .add(data)
        .then(() => {
          this.submitted = false;
          this.orderForm.reset();
          this.cart = [];
          this.subTotal = 0;
          this.deliveryCharge = 0;
          this.openNav();
          this.stateAllProduct();
          sessionStorage.clear();
          this.goToOrderF(2);
        });
    } else {
      this.loginService.showAlert(
        "error",
        "Your network is too poor or currently you are in offline.",
        "Please check your internet"
      );
    }
  }
}
