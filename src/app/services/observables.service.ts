import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import {
  map,
  take,
  shareReplay,
  finalize,
  tap,
  catchError,
  filter,
} from "rxjs/operators";
import { Observable, from, BehaviorSubject, throwError } from "rxjs";
import { Products, Customize } from "../model/models";
import { LoadingService } from "./loading.service";
import { MessageService } from "./message.service";
import { allProducts } from "src/products/allProducts";
import { environment } from "src/environments/environment.prod";
import * as CryptoJS from "crypto-js";
@Injectable({
  providedIn: "root",
})
export class ObservablesService {
  productCollection: string = "myproducts";
  productCategories: string[] = ["homemade", "organic", "sweet"];

  private productSubject = new BehaviorSubject<Products[]>([]);
  productObservables$: Observable<
    Products[]
  > = this.productSubject.asObservable();
  //====================================
  //get all customized data
  //====================================
  private customizeDataSubject = new BehaviorSubject<any>(null);
  public custmizeDataObservable$ = this.customizeDataSubject.asObservable();
  //==============================================================

  /**
   * product store and state
   * return session policy
   */
  product: any[] = [];
  cart: any[] = [];

  constructor(
    private afs: AngularFirestore,
    private loadingService: LoadingService,
    private sl: MessageService
  ) {
    // this.fetchData();
    // this.fetchCoustomizeData();
  }
  //==========================reference====================
  // fetchData(): Observable<Products[]> {
  //   this.loadingService.loadingOn();
  //   this.productObservables$ = this.afs
  //     .collection<any>(this.productCollection)
  //     .valueChanges()
  //     .pipe(
  //       take(1), // command run only one time
  //       map((res: any) => {
  //         return res;
  //       }),
  //       shareReplay(), // command run only one time
  //       finalize(() => this.loadingService.loadingOff()) // after completing the data fetch
  //     );
  //   return this.productObservables$;
  // }

  fetchCoustomizeData() {
    const customize = this.afs
      .collection<any>(this.productCollection)
      .doc("customize")
      .get()
      .toPromise()
      .then((res) => {
        const data = res.data();
        this.customizeDataSubject.next(data);
        this.customizeDataSubject.complete();
      })
      .catch((err) => {
        console.log("err", err);
        this.sl.err_message(1);
      });
  }
  filterCustomData(cat): Observable<any[]> {
    return this.custmizeDataObservable$.pipe(
      filter((action) => {
        if (action !== null) {
          console.log(action[cat]);
          return action[cat];
        }
      })
    );
  }

  //======================set all product state==============
  getEncryptedData(sessionName: string) {
    const data = sessionStorage.getItem(sessionName);
    var bytes = CryptoJS.AES.decrypt(data, environment.serectkey);
    var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    let result = decryptedData;
    return result;
  }
  stateAllProduct() {
    if (sessionStorage.getItem("user") !== null) {
      this.cart = this.getEncryptedData("user");
    }
    this.product = allProducts.map(
      function (n) {
        let index = this.cart.findIndex((m) => m.id === n.id);
        n.state = index !== -1 ? true : false;
        return n;
      }.bind(this)
    );
    return this.product;
  }
}
