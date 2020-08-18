import { Component, OnInit } from "@angular/core";
import { AdminLoginService } from "../auth/admin-login.service";
import { map } from "rxjs/operators";
@Component({
  selector: "app-admin-panel",
  templateUrl: "./admin-panel.component.html",
  styleUrls: ["./admin-panel.component.scss"],
})
export class AdminPanelComponent implements OnInit {
  allOrders: any[] = [];
  details: any = null;
  constructor(private loginService: AdminLoginService) {}

  ngOnInit() {
    this.fetchAllOrders();
  }
  logout() {
    this.loginService.logout();
  }
  fetchAllOrders() {
    this.allOrders = [];
    this.loginService.afs
      .collection(this.loginService.orderCollection)
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a) => {
            const data: any = a.payload.doc.data();
            const id = a.payload.doc.id;
            return { id, ...data };
          });
        })
      )
      .subscribe((res) => {
        this.allOrders = res;
        this.allOrders.sort(
          (a: any, b: any) => b.time.seconds - a.time.seconds
        );
        console.log(res);
      });
  }
  orderDetails(order) {
    this.details = order;
  }
  deliveredOrder(order) {
    this.loginService.afs
      .collection(this.loginService.orderCollection)
      .doc(order.id)
      .update({
        status: "delivered",
      });
  }
  deleteOrder(order) {
    this.loginService.afs
      .collection(this.loginService.orderCollection)
      .doc(order.id)
      .delete();
  }
}
