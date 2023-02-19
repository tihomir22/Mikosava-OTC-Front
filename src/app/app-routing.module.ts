import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CloseTradeNftComponent } from './close-trade-nft/close-trade-nft.component';
import { CloseTradeNftResolver } from './close-trade-nft/close-trade-nft.resolver';
import { CloseTradeComponent } from './close-trade/close-trade.component';
import { TradeResolver } from './close-trade/trade.resolver';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LandingComponent } from './landing/landing.component';
import { SwapComponent } from './swap/swap.component';
import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'swap', component: SwapComponent },
  { path: 'list', component: UserListComponent },
  {
    path: 'trade/:idTrade',
    component: CloseTradeComponent,
    resolve: { idTrade: TradeResolver },
  },
  {
    path: 'nft-trade/:idTradeNft',
    component: CloseTradeNftComponent,
    resolve: { idTradeNft: CloseTradeNftResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
