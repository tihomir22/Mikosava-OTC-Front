import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListNftsComponent } from './list-nfts.component';

describe('ListNftsComponent', () => {
  let component: ListNftsComponent;
  let fixture: ComponentFixture<ListNftsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListNftsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListNftsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
