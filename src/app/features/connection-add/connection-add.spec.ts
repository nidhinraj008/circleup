import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionAdd } from './connection-add';

describe('ConnectionAdd', () => {
  let component: ConnectionAdd;
  let fixture: ComponentFixture<ConnectionAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
