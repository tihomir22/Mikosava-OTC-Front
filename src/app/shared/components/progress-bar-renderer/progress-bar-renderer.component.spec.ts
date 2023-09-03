import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressBarRendererComponent } from './progress-bar-renderer.component';

describe('ProgressBarRendererComponent', () => {
  let component: ProgressBarRendererComponent;
  let fixture: ComponentFixture<ProgressBarRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProgressBarRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressBarRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
