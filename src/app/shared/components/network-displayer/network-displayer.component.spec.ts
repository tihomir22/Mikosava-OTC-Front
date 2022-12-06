import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetworkDisplayerComponent } from './network-displayer.component';

describe('NetworkDisplayerComponent', () => {
  let component: NetworkDisplayerComponent;
  let fixture: ComponentFixture<NetworkDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NetworkDisplayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NetworkDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
