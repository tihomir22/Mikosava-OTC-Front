import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PairDisplayerComponent } from './pair-displayer.component';

describe('PairDisplayerComponent', () => {
  let component: PairDisplayerComponent;
  let fixture: ComponentFixture<PairDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PairDisplayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PairDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
