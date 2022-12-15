import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoinImgBadgeComponent } from './coin-img-badge.component';

describe('CoinImgBadgeComponent', () => {
  let component: CoinImgBadgeComponent;
  let fixture: ComponentFixture<CoinImgBadgeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoinImgBadgeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CoinImgBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
