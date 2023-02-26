import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDialogListTradesComponent } from './filter-dialog-list-trades.component';

describe('FilterDialogListTradesComponent', () => {
  let component: FilterDialogListTradesComponent;
  let fixture: ComponentFixture<FilterDialogListTradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterDialogListTradesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilterDialogListTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
