import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdenticoinComponent } from './identicoin.component';

describe('IdenticoinComponent', () => {
  let component: IdenticoinComponent;
  let fixture: ComponentFixture<IdenticoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IdenticoinComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IdenticoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
