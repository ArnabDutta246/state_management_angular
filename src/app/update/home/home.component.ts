import { Component, OnInit } from "@angular/core";
import { ObservablesService } from "src/app/services/observables.service";
import { LoadingService } from "src/app/services/loading.service";
import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";
import { Banner, Entrep } from "src/app/model/models";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class UpdateHomeComponent implements OnInit {
  banner$: any[] = [];
  enterprenourse$: any[] = [];
  constructor(
    private observables: ObservablesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.setCarouselEntreprenourse();
  }
  setCarouselEntreprenourse() {
    this.loadingService.loadingOn();
    this.observables.custmizeDataObservable$.subscribe(
      (res) => {
        if (res !== null) {
          this.banner$ = res["banner"];
          this.enterprenourse$ = res["entrepreneurs"];
        }
      },
      (err) => {
        console.log(err);
        this.loadingService.loadingOff();
      },
      () => {
        this.loadingService.loadingOff();
      }
    );
  }
}
