import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HorizontalMenuBar } from './horizontal-menu-bar';

describe('HorizontalMenuBar', () => {
  let component: HorizontalMenuBar;
  let fixture: ComponentFixture<HorizontalMenuBar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HorizontalMenuBar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HorizontalMenuBar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
