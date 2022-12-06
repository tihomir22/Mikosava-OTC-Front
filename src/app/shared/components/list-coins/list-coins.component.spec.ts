import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCoinsComponent } from './list-coins.component';

describe('ListCoinsComponent', () => {
  let component: ListCoinsComponent;
  let fixture: ComponentFixture<ListCoinsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListCoinsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListCoinsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
