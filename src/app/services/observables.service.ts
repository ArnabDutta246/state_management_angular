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
  constructor(
    private afs: AngularFirestore,
    private loadingService: LoadingService,
    private sl: MessageService
  ) {
    // this.fetchData();
    this.fetchCoustomizeData();
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
}
