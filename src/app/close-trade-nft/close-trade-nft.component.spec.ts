import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseTradeNftComponent } from './close-trade-nft.component';

describe('CloseTradeNftComponent', () => {
  let component: CloseTradeNftComponent;
  let fixture: ComponentFixture<CloseTradeNftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseTradeNftComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseTradeNftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
