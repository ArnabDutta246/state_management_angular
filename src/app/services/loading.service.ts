import { Injectable } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
  prodDetails: any;

  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();
  constructor() {}

  showLoadingUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
    return undefined;
  }
  loadingOn() {
    this.loadingSubject.next(true);
  }
  loadingOff() {
    this.loadingSubject.next(false);
  }

  //===============================
  // side bar open close
  //===============================
  openNav() {
    let sideDrawer = document.getElementById("side-drawer");
    sideDrawer.classList.contains("open")
      ? this.openClose(sideDrawer, "close", "open")
      : this.openClose(sideDrawer, "open", "close");
    //if (!this.cartState) this.goToOrderF(2);
  }
  openClose = (sideDrawer, add, remove) => {
    sideDrawer.classList.remove(remove);
    sideDrawer.classList.add(add);
  };
}
