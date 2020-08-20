import { Component, OnInit } from "@angular/core";
import { ObservablesService } from "src/app/services/observables.service";
import { LoadingService } from "src/app/services/loading.service";
import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";
import { Banner, Entrep } from "src/app/model/models";
import { OwlOptions } from "ngx-owl-carousel-o";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class UpdateHomeComponent implements OnInit {
  banner$: any[] = [];
  enterprenourse$: any[] = [];
  products: any = [];
  constructor(
    private observables: ObservablesService,
    private loadingService: LoadingService
  ) {
    //=============load products data=====
    this.products = this.observables.stateAllProduct();
  }

  ngOnInit() {
    //this.setCarouselEntreprenourse();
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

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 1000,
    navText: ["", ""],
    autoplay: true,
    autoplayTimeout: 10000,
    autoplaySpeed: 700,
    responsive: {
      0: {
        items: 3,
      },
      400: {
        items: 4,
      },
      740: {
        items: 4,
      },
      940: {
        items: 4,
      },
    },
    nav: false,
  };
}
