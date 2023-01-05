import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidUntilProgressbarComponent } from './valid-until-progressbar.component';

describe('ValidUntilProgressbarComponent', () => {
  let component: ValidUntilProgressbarComponent;
  let fixture: ComponentFixture<ValidUntilProgressbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidUntilProgressbarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidUntilProgressbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
