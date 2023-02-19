import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TxOngoingModalComponent } from './tx-ongoing-modal.component';

describe('TxOngoingModalComponent', () => {
  let component: TxOngoingModalComponent;
  let fixture: ComponentFixture<TxOngoingModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TxOngoingModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TxOngoingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
