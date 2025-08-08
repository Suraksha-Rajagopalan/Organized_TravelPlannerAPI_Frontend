import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Rate } from './rate';

describe('Rate', () => {
  let component: Rate;
  let fixture: ComponentFixture<Rate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Rate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Rate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
