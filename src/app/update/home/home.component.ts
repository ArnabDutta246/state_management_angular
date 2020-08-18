import { Component, OnInit } from "@angular/core";
import { ObservablesService } from "src/app/services/observables.service";
import { LoadingService } from "src/app/services/loading.service";
import { Observable } from "rxjs";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class UpdateHomeComponent implements OnInit {
  carousel$: Observable<any>;
  enterprenourse$: Observable<any>;
  constructor(
    private observables: ObservablesService,
    private loadingService: LoadingService
  ) {}

  ngOnInit() {
    this.setCarouselEntreprenourse();
  }
  setCarouselEntreprenourse() {
    this.carousel$ = this.observables.filterCarousalOrEntreprenours("banner");
    this.enterprenourse$ = this.observables.filterCarousalOrEntreprenours(
      "entrepreneurs"
    );

    console.log("1", this.carousel$);
    console.log("2", this.enterprenourse$);
  }
}
