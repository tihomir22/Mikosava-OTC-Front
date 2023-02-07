import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Erc721SwapComponent } from './erc721-swap.component';

describe('Erc721SwapComponent', () => {
  let component: Erc721SwapComponent;
  let fixture: ComponentFixture<Erc721SwapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Erc721SwapComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Erc721SwapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
