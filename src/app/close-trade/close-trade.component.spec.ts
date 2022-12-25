import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseTradeComponent } from './close-trade.component';

describe('CloseTradeComponent', () => {
  let component: CloseTradeComponent;
  let fixture: ComponentFixture<CloseTradeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseTradeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseTradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
