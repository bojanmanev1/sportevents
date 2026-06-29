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
  registration?: Date | any | null;
  description?: string;
  startDate?: Date | null;
  website?: string;
  prize?: string;
  showInTopMenu?: boolean;
  latitude?: number | string | null;
  longitude?: number | string | null;

  // NEW
  status?: 'upcoming' | 'ongoing' | 'closed';
}

@Injectable({ providedIn: 'root' })
export class TournamentService {
  private collectionName = 'tournaments';

  private tournaments$: Observable<Tournament[]>;

  constructor(private firestore: Firestore) {
    const ref = collection(this.firestore, this.collectionName);

    const toDate = (v: any): Date | null => {
      if (!v) return null;
      if (v instanceof Date) return v;
      if (typeof v?.toDate === 'function') return v.toDate(); // Firestore Timestamp
      if (typeof v === 'string') {
        const d = new Date(v);
        return isNaN(d.getTime()) ? null : d;
      }
      return null;
    };

   this.tournaments$ = (collectionData(ref, { idField: 'id' }) as Observable<any[]>).pipe(
  map(list =>
    list.map((t: any) => ({
      ...t,
      startDate: toDate(t.startDate),
      registration: toDate(t.registration), // <-- Ensure this line is added to map registration dates!
      latitude: toNum(t.latitude),
      longitude: toNum(t.longitude),
      status: t.status ?? 'upcoming',
    })) as Tournament[]
  ),
  shareReplay(1)
);
  }

  getAll(): Observable<Tournament[]> {
    return this.tournaments$;
  }

  // FOR EVENTS GRID - only tournaments not started yet
  getUpcoming(): Observable<Tournament[]> {
    return this.tournaments$.pipe(
      map(list =>
        list
          .filter(t => t.status === 'upcoming')
          .sort((a, b) => {
            const at = a.startDate ? a.startDate.getTime() : Number.MAX_SAFE_INTEGER;
            const bt = b.startDate ? b.startDate.getTime() : Number.MAX_SAFE_INTEGER;
            return at - bt;
          })
      )
    );
  }

  // FOR LATER
  getOngoing(): Observable<Tournament[]> {
    return this.tournaments$.pipe(
      map(list =>
        list
          .filter(t => t.status === 'ongoing')
          .sort((a, b) => {
            const at = a.startDate ? a.startDate.getTime() : Number.MAX_SAFE_INTEGER;
            const bt = b.startDate ? b.startDate.getTime() : Number.MAX_SAFE_INTEGER;
            return at - bt;
          })
      )
    );
  }

  // FOR LATER
  getClosed(): Observable<Tournament[]> {
    return this.tournaments$.pipe(
      map(list =>
        list
          .filter(t => t.status === 'closed')
          .sort((a, b) => {
            const at = a.startDate ? a.startDate.getTime() : Number.MAX_SAFE_INTEGER;
            const bt = b.startDate ? b.startDate.getTime() : Number.MAX_SAFE_INTEGER;
            return bt - at;
          })
      )
    );
  }

  getTopMenu(): Observable<Tournament[]> {
    return this.tournaments$.pipe(
      map(list =>
        list
          .filter(t => t.showInTopMenu)
          .sort((a, b) => {
            const at = a.startDate ? a.startDate.getTime() : Number.MAX_SAFE_INTEGER;
            const bt = b.startDate ? b.startDate.getTime() : Number.MAX_SAFE_INTEGER;
            return at - bt;
          })
          .slice(0, 10)
      )
    );
  }
}

const toNum = (v: any): number | null => {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(v);
  return Number.isFinite(n) ? n : null;
};