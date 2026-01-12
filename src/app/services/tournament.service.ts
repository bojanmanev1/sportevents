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
  registration?: 'Open' | 'Closed' | 'Not open yet';
  description?: string;
  startDate?: Date | null;
  prize?: string;
  showInTopMenu?: boolean;
  latitude?: number | string | null;
  longitude?: number | string | null;
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

    // ✅ Normalize once here so all consumers get Date|null
    this.tournaments$ = (collectionData(ref, { idField: 'id' }) as Observable<any[]>).pipe(
      map(list =>
        list.map((t: any) => ({
          ...t,
          startDate: toDate(t.startDate),
          latitude: toNum(t.latitude),
          longitude: toNum(t.longitude),
        })) as Tournament[]
      ),
      shareReplay(1)
    );
  }

  getAll(): Observable<Tournament[]> {
    return this.tournaments$;
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

