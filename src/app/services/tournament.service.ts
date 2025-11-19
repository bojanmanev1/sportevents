import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Tournament {
  id?: string;
  name: string;
  sport: string;
  discipline?: string;
  location?: string;
  registration?: 'Open' | 'Closed';
  description?: string;
  startDate?: string;
  prize?: string;
}

@Injectable({ providedIn: 'root' })
export class TournamentService {
  private collectionName = 'tournaments';

  constructor(private firestore: Firestore) {}

  list(): Observable<Tournament[]> {
    const tournamentsRef = collection(this.firestore, this.collectionName);
    return collectionData(tournamentsRef, { idField: 'id' }) as Observable<Tournament[]>;
  }
}
