import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SwapComponent } from './swap/swap.component';

const routes: Routes = [{ path: '', component: SwapComponent }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
