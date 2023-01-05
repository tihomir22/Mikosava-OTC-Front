import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDisplayerComponent } from './status-displayer.component';

describe('StatusDisplayerComponent', () => {
  let component: StatusDisplayerComponent;
  let fixture: ComponentFixture<StatusDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusDisplayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
