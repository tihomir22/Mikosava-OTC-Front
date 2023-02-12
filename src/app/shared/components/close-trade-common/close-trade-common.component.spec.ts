import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CloseTradeCommonComponent } from './close-trade-common.component';

describe('CloseTradeCommonComponent', () => {
  let component: CloseTradeCommonComponent;
  let fixture: ComponentFixture<CloseTradeCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CloseTradeCommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CloseTradeCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
