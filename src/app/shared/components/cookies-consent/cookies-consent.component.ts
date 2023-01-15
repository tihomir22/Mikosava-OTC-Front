import { Component } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-cookies-consent',
  templateUrl: './cookies-consent.component.html',
  styleUrls: ['./cookies-consent.component.scss'],
})
export class CookiesConsentComponent {
  public show = false;
  constructor(private cookiesService: CookieService) {}

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    const cookiesAccepted = this.cookiesService.get('COOKIES_ACCEPTED');
    if (cookiesAccepted.length == 0 || cookiesAccepted != 'YES') {
      this.show = true;
    }
  }

  public accept() {
    this.cookiesService.set('COOKIES_ACCEPTED', 'YES');
    this.show = false;
  }
}
