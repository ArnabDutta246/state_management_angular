import { Injectable } from "@angular/core";
import { Observable, Subject, BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class LoadingService {
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
}
