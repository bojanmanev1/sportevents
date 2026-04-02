import {
  Component,
  OnInit,
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';

import { HomeSliderService, HomeSlide } from '../../services/home-slider.service';
import { TournamentService, Tournament } from '../../services/tournament.service';
import { TournamentDetailsDialogComponent } from '../tournament-details-dialog/tournament-details-dialog';

@Component({
  selector: 'app-home-slider',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home-slider.component.html',
  styleUrls: ['./home-slider.component.scss'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HomeSliderComponent implements OnInit, AfterViewInit {
  @ViewChild('swiperEl') swiperEl?: ElementRef<any>;

  slides: HomeSlide[] = [];
  tournaments: Tournament[] = [];
  private viewReady = false;

  constructor(
    private sliderService: HomeSliderService,
    private tournamentService: TournamentService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.sliderService.getSlides().subscribe(slides => {
      this.slides = slides;

      if (this.viewReady) {
        setTimeout(() => this.initSwiper(), 0);
      }
    });

    this.tournamentService.getAll().subscribe(items => {
      this.tournaments = items;
    });
  }

  ngAfterViewInit(): void {
    this.viewReady = true;
    setTimeout(() => this.initSwiper(), 0);
  }

  openSlide(slide: HomeSlide): void {
    debugger
    if (!slide.tournamentId) return;

    const tournament = this.tournaments.find(t => t.id === slide.tournamentId);
    if (!tournament) return;

    this.dialog.open(TournamentDetailsDialogComponent, {
      data: tournament,
      width: '700px',
      panelClass: 'custom-dialog-container'
    });
  }

  private initSwiper(): void {
    const el = this.swiperEl?.nativeElement;
    if (!el || !this.slides.length) return;

    const shouldLoop = this.slides.length > 3;
    const shouldShowNavigation = this.slides.length > 3;

    const params = {
      slidesPerView: 1,
      spaceBetween: 40,
      loop: shouldLoop,
      navigation: shouldShowNavigation,
      autoplay: shouldLoop
        ? {
            delay: 5000,
            disableOnInteraction: false
          }
        : false,
      breakpoints: {
        768: {
          slidesPerView: 3,
          spaceBetween: 40
        }
      },
      injectStyles: [`
        .swiper-button-prev,
        .swiper-button-next {
          color: #00bfa5 !important;
          width: 36px;
          height: 36px;
          margin-top: -18px;
        }

        .swiper-button-prev::after,
        .swiper-button-next::after {
          font-size: 14px;
          font-weight: 800;
        }

        .swiper-button-prev {
          left: -233px;
        }

        .swiper-button-next {
          right: -233px;
        }

        .swiper-button-disabled {
          opacity: 0.35;
        }
          
        @media (max-width: 1100px) {
          .swiper-button-prev {
            left: -42px;
          }

          .swiper-button-next {
            right: -42px;
          }
        }

        @media (max-width: 768px) {
          .swiper-button-prev,
          .swiper-button-next {
            width: 30px;
            height: 30px;
            margin-top: -15px;
          }

          .swiper-button-prev {
            left: -6px;
          }

          .swiper-button-next {
            right: -6px;
          }

          .swiper-button-prev::after,
          .swiper-button-next::after {
            font-size: 12px;
          }
        }
      `]
    };

    if (!el.swiper) {
      Object.assign(el, params);
      el.initialize();
      return;
    }

    Object.assign(el, params);
    el.swiper.params.slidesPerView = 1;
    el.swiper.params.spaceBetween = 40;
    el.swiper.params.loop = shouldLoop;
    el.swiper.params.navigation = shouldShowNavigation;
    el.swiper.params.autoplay = shouldLoop
      ? {
          delay: 5000,
          disableOnInteraction: false
        }
      : false;
    el.swiper.params.breakpoints = {
      768: {
        slidesPerView: 3,
        spaceBetween: 40
      }
    };
    el.swiper.params.injectStyles = params.injectStyles;

    el.swiper.update();
  }
}