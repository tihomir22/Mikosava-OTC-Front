import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusDisplayerRendererComponent } from './status-displayer-renderer.component';

describe('StatusDisplayerRendererComponent', () => {
  let component: StatusDisplayerRendererComponent;
  let fixture: ComponentFixture<StatusDisplayerRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StatusDisplayerRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StatusDisplayerRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
