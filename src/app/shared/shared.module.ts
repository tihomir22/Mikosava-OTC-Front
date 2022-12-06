import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardComponent } from './components/card/card.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AddressDisplayerComponent } from './components/address-displayer/address-displayer.component';
import { NetworkDisplayerComponent } from './components/network-displayer/network-displayer.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ListCoinsComponent } from './components/list-coins/list-coins.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CardComponent,
    NavbarComponent,
    AddressDisplayerComponent,
    NetworkDisplayerComponent,
    ListCoinsComponent,
  ],
  imports: [
    CommonModule,
    CollapseModule,
    BsDropdownModule.forRoot(),
    ScrollingModule,
    FormsModule,
  ],
  exports: [
    CardComponent,
    NavbarComponent,
    AddressDisplayerComponent,
    NetworkDisplayerComponent,
    ListCoinsComponent,
  ],
})
export class SharedModule {}
