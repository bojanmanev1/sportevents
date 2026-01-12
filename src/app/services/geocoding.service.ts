import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GeocodingService {
  constructor(private http: HttpClient) {}

  // Photon: https://photon.komoot.io/api/?q=Skopje&limit=1
  geocode(query: string): Observable<{ lat: number; lon: number } | null> {
    const q = encodeURIComponent(query.trim());
    const url = `https://photon.komoot.io/api/?q=${q}&limit=1`;

    return this.http.get<any>(url).pipe(
      map(res => {
        const f = res?.features?.[0];
        const coords = f?.geometry?.coordinates; // [lon, lat]
        if (!coords || coords.length < 2) return null;
        return { lon: coords[0], lat: coords[1] };
      })
    );
  }
}
