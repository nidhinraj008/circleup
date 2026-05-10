import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonList } from './person-list';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { removePerson } from '../store';
import { LongPressDirective } from '../../shared/directives/long-press';

describe('PersonList', () => {

  let component: PersonList;
  let fixture: ComponentFixture<PersonList>;
  let router: jasmine.SpyObj<Router>;
  let store: jasmine.SpyObj<Store>;

  const mockPersons = [
    {
      id: 1,
      name: 'John',
      gender: 2,
      dateOfBirth: new Date(1990, 1, 1),
      father: '',
      mother: '',
      notes: '',
      primaryImageUrl: '',
      home: '',
      status: 1
    }
  ];

  const mockModalInstance = {
    show: jasmine.createSpy('show'),
    hide: jasmine.createSpy('hide'),
    dispose: jasmine.createSpy('dispose')
  };

  beforeEach(async () => {

    router = jasmine.createSpyObj('Router', ['navigate']);
    store = jasmine.createSpyObj('Store', ['select', 'dispatch']);

    store.select.and.returnValue(of(mockPersons));

    await TestBed.configureTestingModule({
      imports: [PersonList],
      providers: [
        { provide: Router, useValue: router },
        { provide: Store, useValue: store }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonList);
    component = fixture.componentInstance;

    // Mock the bootstrap Modal instances created via @ViewChild in ngAfterViewInit
    (component as any).actionsModalInstance = { ...mockModalInstance };
    (component as any).sortingModalInstance = { ...mockModalInstance };
    (component as any).deleteConfirmationModalInstance = { ...mockModalInstance };

    fixture.detectChanges();

  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load persons on init', () => {
    component.ngOnInit();
    expect(store.select).toHaveBeenCalled();
  });

  it('should navigate to view page when item clicked', () => {
    const item = { id: 10 };
    component.onClickItem(item);
    expect(router.navigate).toHaveBeenCalledWith(['persons/view', 10]);
  });

  it('should set selected item and show actions modal on long press', () => {
    const item = { id: 5 };
    component.onItemLongPress(item);
    expect(component.selectedItem).toEqual(item);
    expect((component as any).actionsModalInstance.show).toHaveBeenCalled();
  });

  it('should navigate to edit page', () => {
    component.selectedItem = { id: 20 };
    component.onClickEdit();
    expect((component as any).actionsModalInstance.hide).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['persons/edit', 20]);
  });

  it('should navigate to clone page', () => {
    component.selectedItem = { id: 30 };
    component.onClickClone();
    expect(router.navigate).toHaveBeenCalledWith(['persons/add', 30]);
  });

  it('should dispatch removePerson and close modals', () => {

    component.selectedItem = { id: 99 };

    component.onClickDelete();

    expect(store.dispatch).toHaveBeenCalledWith(
      removePerson({ personId: 99 })
    );

    expect((component as any).deleteConfirmationModalInstance.hide).toHaveBeenCalled();
    expect((component as any).actionsModalInstance.hide).toHaveBeenCalled();

  });

});
