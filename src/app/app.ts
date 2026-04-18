import { Component, signal, OnInit, OnDestroy } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { PageTransitionService } from './shared/services/page-transition.service';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  protected readonly title = signal('IBIS - Integrated Bonded Inventory System');

  isTransitioning = false;
  transitionClass = '';
  private subscriptions = new Subscription();

  constructor(
    private router: Router,
    private pageTransitionService: PageTransitionService
  ) { }

  ngOnInit(): void {
    // Subscribe to transition state
    this.subscriptions.add(
      this.pageTransitionService.isTransitioning$.subscribe(
        isTransitioning => this.isTransitioning = isTransitioning
      )
    );

    // Subscribe to router events for page transitions
    this.subscriptions.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.transitionClass = this.pageTransitionService.getTransitionClass();
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}