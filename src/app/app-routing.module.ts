import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CloseTradeComponent } from './close-trade/close-trade.component';
import { TradeResolver } from './close-trade/trade.resolver';
import { SwapComponent } from './swap/swap.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  { path: '', component: SwapComponent },
  { path: 'swap', component: SwapComponent },
  { path: 'list', component: UserListComponent },
  {
    path: 'trade/:idTrade',
    component: CloseTradeComponent,
    resolve: { idTrade: TradeResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
