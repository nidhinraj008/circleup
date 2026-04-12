import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectionView } from './connection-view';

describe('ConnectionView', () => {
  let component: ConnectionView;
  let fixture: ComponentFixture<ConnectionView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectionView]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectionView);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
