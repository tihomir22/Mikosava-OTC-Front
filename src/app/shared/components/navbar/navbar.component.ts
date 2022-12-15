import { Component, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { State } from 'src/app/reducers';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent {
  @Input() public isCollapsed: boolean = false;

  constructor(private store: Store<any>, public route: ActivatedRoute) {
    this.store
      .select((action: State) => action.account)
      .subscribe((account) => console.log(account));

  }

  ngOnInit(): void {}

  public isCurrentPathActive(pathToCheck:string):boolean{
    return pathToCheck == window.location.pathname
  }
}
