import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SwapComponent } from './swap/swap.component';
import { SharedModule } from './shared/shared.module';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { environment } from 'src/environments/environment';
import { ToastrModule } from 'ngx-toastr';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserListComponent } from './user-list/user-list.component';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { CloseTradeComponent } from './close-trade/close-trade.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LandingComponent } from './landing/landing.component';
import { EffectsModule } from '@ngrx/effects';
import { CookieService } from 'ngx-cookie-service';
import { Erc20SwapComponent } from './swap/components/erc20-swap/erc20-swap.component';
import { Erc721SwapComponent } from './swap/components/erc721-swap/erc721-swap.component';
import { CloseTradeNftComponent } from './close-trade-nft/close-trade-nft.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AgGridModule } from 'ag-grid-angular';
import { FromAddressToCgPipe } from './shared/pipes/from-address-to-cg.pipe';
import { DecimalPipe } from '@angular/common';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}
@NgModule({
  declarations: [
    AppComponent,
    SwapComponent,
    UserListComponent,
    CloseTradeComponent,
    LandingComponent,
    Erc20SwapComponent,
    Erc721SwapComponent,
    CloseTradeNftComponent,
    DashboardComponent,
  ],
  imports: [
    ScrollingModule,
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    SharedModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    NgxBootstrapIconsModule.pick(allIcons),
    StoreModule.forRoot(reducers, {
      metaReducers,
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
    ToastrModule.forRoot({ positionClass: 'toast-bottom-center' }),
    NgxSkeletonLoaderModule.forRoot({ animation: 'pulse' }),
    BsDropdownModule.forRoot(),
    EffectsModule.forRoot([]),
    HttpClientModule,
    AgGridModule,
  ],
  providers: [CookieService, FromAddressToCgPipe, DecimalPipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
