import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc20SwapComponent } from './erc20-swap.component';

describe('Erc20SwapComponent', () => {
  let component: Erc20SwapComponent;
  let fixture: ComponentFixture<Erc20SwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Erc20SwapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Erc20SwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
