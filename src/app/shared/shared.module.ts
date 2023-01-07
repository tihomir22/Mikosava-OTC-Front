import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AddressDisplayerComponent } from './components/address-displayer/address-displayer.component';
import { NetworkDisplayerComponent } from './components/network-displayer/network-displayer.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ListCoinsComponent } from './components/list-coins/list-coins.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { RouterModule } from '@angular/router';
import { CoinImgBadgeComponent } from './components/coin-img-badge/coin-img-badge.component';
import { FromAddressToCgPipe } from './pipes/from-address-to-cg.pipe';
import { ParseFromWeiToDecimalNumberPipe } from './pipes/parse-from-wei-to-decimal-number.pipe';
import { NgxBootstrapIconsModule, allIcons } from 'ngx-bootstrap-icons';
import { ShareModalComponent } from './components/share-modal/share-modal.component';
import { QRCodeModule } from 'angularx-qrcode';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TranslateModule } from '@ngx-translate/core';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { StatusDisplayerComponent } from './components/status-displayer/status-displayer.component';
import { ValidUntilProgressbarComponent } from './components/valid-until-progressbar/valid-until-progressbar.component';
import { SortPipe } from './pipes/sort.pipe';
@NgModule({
  declarations: [
    NavbarComponent,
    AddressDisplayerComponent,
    NetworkDisplayerComponent,
    ListCoinsComponent,
    CoinImgBadgeComponent,
    FromAddressToCgPipe,
    ParseFromWeiToDecimalNumberPipe,
    ShareModalComponent,
    NotFoundComponent,
    StatusDisplayerComponent,
    ValidUntilProgressbarComponent,
    SortPipe,
  ],
  imports: [
    CommonModule,
    CollapseModule,
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),
    BsDatepickerModule.forRoot(),
    RouterModule,
    ReactiveFormsModule,
    ScrollingModule,
    FormsModule,
    PopoverModule,
    QRCodeModule,
    TooltipModule,
    DatePipe,
    TranslateModule,
    NgxSkeletonLoaderModule,
    NgxBootstrapIconsModule.pick(allIcons),
  ],
  exports: [
    NavbarComponent,
    AddressDisplayerComponent,
    NetworkDisplayerComponent,
    ListCoinsComponent,
    ReactiveFormsModule,
    BsDatepickerModule,
    CoinImgBadgeComponent,
    FromAddressToCgPipe,
    TooltipModule,
    ShareModalComponent,
    PopoverModule,
    DatePipe,
    NotFoundComponent,
    ParseFromWeiToDecimalNumberPipe,
    StatusDisplayerComponent,
    ValidUntilProgressbarComponent,
    SortPipe,
  ],
  providers: [ParseFromWeiToDecimalNumberPipe],
})
export class SharedModule {}
