import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDisplayerComponent } from './address-displayer.component';

describe('AddressDisplayerComponent', () => {
  let component: AddressDisplayerComponent;
  let fixture: ComponentFixture<AddressDisplayerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressDisplayerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressDisplayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
