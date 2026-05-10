import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonAdd } from './person-add';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { AppState } from '../../core/store/app.state';
import { addPerson, updatePerson } from '../store';
import { StatusEnum } from '../../shared/enum/status.enum';
import { CRUDEnum } from '../../shared/enum/crud.enum';
import { of } from 'rxjs';
import { FireService } from '../../shared/services/fire-service';
import { GoogleDriveService } from '../../shared/services/google-drive.service';
import { ActivatedRoute } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { Person } from '../../shared/types/person';

describe('PersonAdd', () => {

  let component: PersonAdd;
  let fixture: ComponentFixture<PersonAdd>;
  let store: MockStore;

  const mockPerson: Person = {
    id: 1,
    name: 'John',
    gender: 1,
    dateOfBirth: new Date('2000-01-01'),
    familyId: 0,
    fatherId: 0,
    motherId: 0,
    notes: '',
    primaryImageUrl: '',
    home: '',
    status: 1,
    deathDate: undefined,
    deathCause: undefined
  };

  const mockInitialState: AppState = {
    persons: {
      ids: [],
      entities: {}
    },
    families: {
      ids: [],
      entities: {}
    },
    authentication: {
      fileUploadFolderId: null
    } as any
  };

  const mockActivatedRoute = {
    data: of({ mode: CRUDEnum.Create }),
    snapshot: {
      paramMap: {
        get: () => null
      }
    }
  };

  const fireServiceMock = {};
  const googleDriveServiceMock = {
    initClient: jasmine.createSpy(),
    searchFolder: () => of({ files: [] }),
    createFolder: () => of({ id: 'folder123' }),
    uploadAsPublicFile: () => of('image-url')
  };

  beforeEach(async () => {

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        FormsModule,
        NgSelectModule,
        PersonAdd
      ],
      providers: [
        FormBuilder,
        provideMockStore({ initialState: mockInitialState }),
        { provide: FireService, useValue: fireServiceMock },
        { provide: GoogleDriveService, useValue: googleDriveServiceMock },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonAdd);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);

    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form', () => {
    expect(component.detailsForm).toBeDefined();
    expect(component.detailsForm.controls['name']).toBeDefined();
  });

  it('should mark form invalid if required fields missing', () => {

    component.detailsForm.patchValue({
      name: '',
      gender: null
    });

    component.onClickSubmit();

    expect(component.detailsForm.invalid).toBeTrue();
  });

  it('should dispatch addPerson when form valid in create mode', () => {

    spyOn(store, 'dispatch');

    component.currentMode = CRUDEnum.Create;

    component.detailsForm.patchValue({
      id: 0,
      name: 'John',
      gender: 1,
      dateOfBirth: '2000-01-01',
      status: StatusEnum.Alive
    });

    component.onClickSubmit();

    expect(store.dispatch).toHaveBeenCalled();
  });

  it('should dispatch updatePerson in edit mode', () => {

    spyOn(store, 'dispatch');

    component.currentMode = CRUDEnum.Update;

    component.detailsForm.patchValue({
      id: 1,
      name: 'John',
      gender: 1,
      dateOfBirth: '2000-01-01',
      status: StatusEnum.Alive
    });

    component.onClickSubmit();

    expect(store.dispatch).toHaveBeenCalledWith(
      updatePerson({ person: mockPerson })
    );
  });

  it('should set file on file change', () => {

    const mockFile = new File(['data'], 'test.png');

    const event = {
      target: {
        files: [mockFile]
      }
    };

    component.onFileChange(event);

    expect(component.fileToUpload).toEqual(mockFile);
  });

  it('should save image link if valid', () => {

    component.imageLink.set('http://image.png');
    component.isImageLinkValid.set(true);

    component.onClickSaveLink();

    expect(component.detailsForm.get('primaryImageUrl')?.value)
      .toBe('http://image.png');
  });

});
