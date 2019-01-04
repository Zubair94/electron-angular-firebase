import { NgModule, SkipSelf, Optional } from '@angular/core';
import { ModuleWithProviders } from '@angular/compiler/src/core';

import { SharedModule } from '../shared/shared.module';
import { AuthorizationService } from './services/authorization.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiRouteInterceptor } from './interceptors/api-route.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ToastrModule } from 'ngx-toastr';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { AlertService } from './services/alert.service';
import { ModalService } from './services/modal.service';
import { environment } from 'src/environments/environment.prod';
import { DepositModalComponent } from './components/deposit-modal/deposit-modal.component';


@NgModule({
  declarations: [DepositModalComponent],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    ToastrModule.forRoot({
      timeOut: 6000,
      positionClass: 'toast-top-center',
      maxOpened: 3,
      autoDismiss: true,
      preventDuplicates: true
    }),
    ModalModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule
  ],
  exports:[
  ],
  entryComponents: [
    DepositModalComponent
  ]
})
export class CoreModule { 
  constructor (@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error('CoreModule is already loaded. Import only in AppModule');
    }
  }

  static forRoot(): ModuleWithProviders{
    return {
      ngModule: CoreModule,
      providers: [
        AuthorizationService,
        AlertService,
        ModalService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: ApiRouteInterceptor,
          multi: true
        }
      ]
    };
  }
}
