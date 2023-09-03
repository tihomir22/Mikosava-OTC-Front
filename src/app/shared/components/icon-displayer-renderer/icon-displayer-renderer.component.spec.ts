import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconDisplayerRendererComponent } from './icon-displayer-renderer.component';

describe('IconDisplayerRendererComponent', () => {
  let component: IconDisplayerRendererComponent;
  let fixture: ComponentFixture<IconDisplayerRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconDisplayerRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconDisplayerRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
