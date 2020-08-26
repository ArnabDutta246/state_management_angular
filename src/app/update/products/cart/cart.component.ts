import { Component, OnInit } from "@angular/core";
import { LoadingService } from "src/app/services/loading.service";

@Component({
  selector: "app-cart",
  templateUrl: "./cart.component.html",
  styleUrls: ["./cart.component.scss"],
})
export class CartComponent implements OnInit {
  constructor(public loadingService: LoadingService) {}

  ngOnInit() {}
}
