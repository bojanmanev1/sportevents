import { Injectable } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export interface Tournament {
  id?: string;
  name: string;
  sport: string;
  discipline?: string;
  location?: string;
  registration?: 'Open' | 'Closed';
  description?: string;
  startDate?: string;
  website?: string;
  prize?: string;
  showInTopMenu?: boolean;
}

@Injectable({ providedIn: 'root' })
export class TournamentService {
  private collectionName = 'tournaments';

  /** 🔥 SINGLE FIRESTORE STREAM */
  private tournaments$: Observable<Tournament[]>;

  constructor(private firestore: Firestore) {
    const ref = collection(this.firestore, this.collectionName);

    this.tournaments$ = (collectionData(ref, { idField: 'id' }) as Observable<Tournament[]>)
      .pipe(
        shareReplay(1) // ✅ now typing is correct
      );
  }

  /** All tournaments */
  getAll(): Observable<Tournament[]> {
    return this.tournaments$;
  }

  /** Top menu only */
  getTopMenu(): Observable<Tournament[]> {
    return this.tournaments$.pipe(
      map(list =>
        list
          .filter(t => t.showInTopMenu)
          .sort(
            (a, b) =>
              new Date(a.startDate ?? '').getTime() -
              new Date(b.startDate ?? '').getTime()
          )
          .slice(0, 10)
      )
    );
  }
}
