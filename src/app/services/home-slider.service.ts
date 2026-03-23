import { Injectable, EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { Firestore, collection, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface HomeSlide {
  id?: string;
  title: string;
  imageUrl: string;
  order: number;
  active: boolean;
}

@Injectable({ providedIn: 'root' })
export class HomeSliderService {
  private collectionName = 'home_slider';

  constructor(
    private firestore: Firestore,
    private injector: EnvironmentInjector
  ) {}

  getSlides(): Observable<HomeSlide[]> {
    return runInInjectionContext(this.injector, () => {
      const ref = collection(this.firestore, this.collectionName);

      return (collectionData(ref, { idField: 'id' }) as Observable<HomeSlide[]>).pipe(
        map(slides =>
          slides
            .filter(slide => slide.active)
            .sort((a, b) => (a.order ?? 9999) - (b.order ?? 9999))
        )
      );
    });
  }
}