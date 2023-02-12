import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListTradesComponent } from './list-trades.component';

describe('ListTradesComponent', () => {
  let component: ListTradesComponent;
  let fixture: ComponentFixture<ListTradesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListTradesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListTradesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
