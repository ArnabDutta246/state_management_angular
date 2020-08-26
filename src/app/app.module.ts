import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { environment } from "../environments/environment.prod";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFirestoreModule } from "@angular/fire/firestore";
import { SafePipe } from "./safe.pipe";
import { FacebookModule } from "ngx-facebook";
import { CarouselModule } from "ngx-owl-carousel-o";
import { AdminLoginComponent } from "./admin/admin-login/admin-login.component";
import { AdminPanelComponent } from "./admin/admin-panel/admin-panel.component";
import { HomeComponent } from "./user/home/home.component";
import { ToastrModule } from "ngx-toastr";
//import { ServiceWorkerModule } from "@angular/service-worker";
import { UpdateHomeComponent } from "./update/home/home.component";
import { LoadingComponent } from "./update/loading/loading.component";
import { LoadingService } from "./services/loading.service";
import { MessageService } from "./services/message.service";
import { CartComponent } from "./update/products/cart/cart.component";
import { DetailsComponent } from "./update/products/details/details.component";
//import { environment } from '../environments/environment';
@NgModule({
  declarations: [
    AppComponent,
    SafePipe,
    AdminLoginComponent,
    AdminPanelComponent,
    HomeComponent,
    UpdateHomeComponent,
    LoadingComponent,
    DetailsComponent,
    CartComponent,
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    FacebookModule.forRoot(),
    CarouselModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: "toast-top-center",
      preventDuplicates: true,
      closeButton: false,
    }),
    // ServiceWorkerModule.register("ngsw-worker.js", {
    //   enabled: environment.production,
    // }),
  ],
  providers: [LoadingService, MessageService],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule {}
