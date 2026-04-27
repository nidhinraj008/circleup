import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData  } from '@angular/fire/firestore';
import { Storage, ref, uploadBytes, getDownloadURL } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root',
})
export class FireService {

  constructor(private firestore: Firestore, private storage: Storage) { }

  public async uploadImage(file: File): Promise<string> {
    const filePath = `image/${Date.now()}_${file.name}`;
    const storageRef = ref(this.storage, filePath);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  }


  public async addPerson(params: any) {
    const refCollection = collection(this.firestore, 'persons');
    return await addDoc(refCollection, params);
  }

  public getAllPersons() {
    const ref = collection(this.firestore, 'persons');
    return collectionData(ref, { idField: 'id' });
  }

}
