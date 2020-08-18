import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { map, take, shareReplay, finalize, tap } from "rxjs/operators";
import { Observable, from, BehaviorSubject } from "rxjs";
import { Products } from "../model/models";
import { LoadingService } from "./loading.service";

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
  private customizeDataSubject = new BehaviorSubject<any>([]);
  public custmizeDataObservable$ = this.customizeDataSubject.asObservable();
  //==============================================================
  constructor(
    private afs: AngularFirestore,
    private loadingService: LoadingService
  ) {
    // this.fetchData();
    this.fetchCoustomizeData();
  }
  fetchData(): Observable<Products[]> {
    this.loadingService.loadingOn();
    this.productObservables$ = this.afs
      .collection<any>(this.productCollection)
      .valueChanges()
      .pipe(
        take(1), // command run only one time
        map((res: any) => {
          return res;
        }),
        shareReplay(), // command run only one time
        finalize(() => this.loadingService.loadingOff()) // after completing the data fetch
      );
    return this.productObservables$;
  }

  fetchCoustomizeData() {
    this.loadingService.loadingOn();
    const customize = this.afs
      .collection(this.productCollection)
      .valueChanges()
      .pipe(
        take(1), // command run only one time
        map((res: any) => {
          return res;
        }),
        shareReplay(), // command run only one time
        tap((res) => this.customizeDataSubject.next(res)), // set inte
        finalize(() => this.loadingService.loadingOff()) // after completing the data fetch
      );
    console.log("after constuctor call ", customize);
    return customize;
  }

  filterCarousalOrEntreprenours(cat: string) {
    return this.custmizeDataObservable$.pipe(
      map((a) => {
        console.log(a);
        return a;
      })
    );
  }
}
