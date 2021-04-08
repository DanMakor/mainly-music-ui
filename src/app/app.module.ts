import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SessionModule } from './session/session.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faAward, faBaby, faBirthdayCake, faCheck, faChevronRight, faCoffee, faCookie, faHome, faMoneyBill, faPlus, faSignOutAlt, faSpinner, faUser } from '@fortawesome/free-solid-svg-icons';
import { PersonModule } from './person/person.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ErrorInterceptor } from './core/error.interceptor';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

const socketIoConfig: SocketIoConfig = { url: environment.baseApiUrl, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    SharedModule,
    AppRoutingModule,
    SessionModule,
    PersonModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    MatSidenavModule,
    MatSnackBarModule,
    SocketIoModule.forRoot(socketIoConfig)
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true
  }],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(faBaby, faUser, faSpinner, faPlus, faHome, faMoneyBill, faCheck, faSignOutAlt, faBirthdayCake, faAward, faCookie, faCoffee, faChevronRight);
  }
}