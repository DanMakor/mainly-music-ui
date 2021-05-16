import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SessionModule } from './session/session.module';
import { HomeComponent } from './home/home.component';
import { SharedModule } from './shared/shared.module';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faAward, faBaby, faBan, faBirthdayCake, faCamera, faCheck, faChevronRight, faClipboard, faCoffee, faCookie, faHome, faMoneyBill, faPlus, faSignOutAlt, faSpinner, faUser, faUserSecret, faUserTie } from '@fortawesome/free-solid-svg-icons';
import { PersonModule } from './person/person.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ErrorInterceptor } from './core/error.interceptor';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { LoadingInterceptor } from './core/loading.interceptor';
import { AuDateAdapter, AU_DATE_FORMAT } from './au-date.adapter';

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
    MatProgressBarModule,
    MatSnackBarModule,
    SocketIoModule.forRoot(socketIoConfig)
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true
    },
    {
      provide: LOCALE_ID,
      useValue: 'en-au'
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: AU_DATE_FORMAT
    },
    {
      provide: DateAdapter,
      useClass: AuDateAdapter
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    // Add an icon to the library for convenient access in other components
    library.addIcons(
      faBaby, 
      faUser, 
      faUserSecret,
      faSpinner, 
      faPlus, 
      faHome, 
      faMoneyBill, 
      faCheck, 
      faSignOutAlt, 
      faBirthdayCake,
      faAward, 
      faCookie, 
      faCoffee,
      faUserTie, 
      faChevronRight,
      faClipboard,
      faCamera,
      faBan
    );
  }
}