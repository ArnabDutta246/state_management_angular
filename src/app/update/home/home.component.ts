import {
  Component,
  OnInit,
  ViewContainerRef,
  ComponentFactoryResolver,
  Type,
} from "@angular/core";
import { ObservablesService } from "src/app/services/observables.service";
import { LoadingService } from "src/app/services/loading.service";
import { Observable } from "rxjs";
import { map, filter } from "rxjs/operators";
import { Banner, Entrep } from "src/app/model/models";
import { OwlOptions } from "ngx-owl-carousel-o";
import { DetailsComponent } from "../products/details/details.component";
@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class UpdateHomeComponent implements OnInit {
  banner$: any[] = [];
  enterprenourse$: any[] = [];
  products: any = [];
  product: any;

  detailLazy: Promise<Type<DetailsComponent>>;
  constructor(
    private observables: ObservablesService,
    public loadingService: LoadingService,
    private viewContainerRef: ViewContainerRef,
    private cfr: ComponentFactoryResolver
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
        items: 5,
      },
      940: {
        items: 5,
      },
    },
    nav: false,
  };

  //================================
  productDetails(data) {
    this.product = data;
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

  //==============lazy loading ==============
  // async load(data) {
  //   this.loadingService.prodDetails = data;
  //   // this.viewContainerRef.clear();
  //   // const { DetailsComponent } = await import(
  //   //   "../products/details/details.component"
  //   // );
  //   // this.viewContainerRef.createComponent(
  //   //   this.cfr.resolveComponentFactory(DetailsComponent)
  //   // );

  //   if (!this.detailLazy) {
  //     this.detailLazy = import("../products/details/details.component").then(
  //       ({ DetailsComponent }) => DetailsComponent
  //     );
  //   }
  // }
}
