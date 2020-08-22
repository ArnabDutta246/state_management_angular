import { Component, OnInit, Input, OnChanges } from "@angular/core";

@Component({
  selector: "app-details",
  templateUrl: "./details.component.html",
  styleUrls: ["./details.component.scss"],
})
export class DetailsComponent implements OnInit, OnChanges {
  @Input() data: any;
  productDetails: any = null;
  constructor() {}

  ngOnInit() {}
  ngOnChanges() {
    this.productDetails = this.data;
  }
}
