import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyAdd } from './family-add';

describe('FamilyAdd', () => {
  let component: FamilyAdd;
  let fixture: ComponentFixture<FamilyAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FamilyAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FamilyAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
