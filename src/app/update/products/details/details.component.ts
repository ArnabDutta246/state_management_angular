import {
  Component,
  OnInit,
  Input,
  OnChanges,
  ViewEncapsulation,
} from "@angular/core";
import { LoadingService } from "src/app/services/loading.service";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class DetailsComponent implements OnInit, OnChanges {
  @Input() data: any;
  productDetails: any = null;
  constructor(private loadingService: LoadingService) {}

  ngOnInit() {}
  ngOnChanges() {
    this.productDetails = this.loadingService.prodDetails;
  }
}
