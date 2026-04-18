import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

/**
 * Page Transition Service
 * Manages smooth page transitions and animations for route changes
 * 
 * Requirements: 10.1-10.6 - Page transition animations
 */
@Injectable({
    providedIn: 'root'
})
export class PageTransitionService {
    private isTransitioning = new BehaviorSubject<boolean>(false);
    private transitionDirection = new BehaviorSubject<'forward' | 'backward' | 'none'>('none');
    private previousRoute = '';
    private currentRoute = '';

    constructor(private router: Router) {
        this.initializeRouteTracking();
    }

    /**
     * Observable for transition state
     */
    get isTransitioning$(): Observable<boolean> {
        return this.isTransitioning.asObservable();
    }

    /**
     * Observable for transition direction
     */
    get transitionDirection$(): Observable<'forward' | 'backward' | 'none'> {
        return this.transitionDirection.asObservable();
    }

    /**
     * Initialize route tracking for transition direction detection
     */
    private initializeRouteTracking(): void {
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: NavigationEnd) => {
                this.previousRoute = this.currentRoute;
                this.currentRoute = event.url;
                this.determineTransitionDirection();
            });
    }

    /**
     * Determine transition direction based on route hierarchy
     */
    private determineTransitionDirection(): void {
        if (!this.previousRoute) {
            this.transitionDirection.next('none');
            return;
        }

        const previousDepth = this.getRouteDepth(this.previousRoute);
        const currentDepth = this.getRouteDepth(this.currentRoute);

        if (currentDepth > previousDepth) {
            this.transitionDirection.next('forward');
        } else if (currentDepth < previousDepth) {
            this.transitionDirection.next('backward');
        } else {
            this.transitionDirection.next('none');
        }
    }

    /**
     * Get route depth for transition direction calculation
     */
    private getRouteDepth(route: string): number {
        return route.split('/').filter(segment => segment.length > 0).length;
    }

    /**
     * Start page transition
     */
    startTransition(): void {
        this.isTransitioning.next(true);
    }

    /**
     * End page transition
     */
    endTransition(): void {
        // Add a small delay to ensure smooth animation completion
        setTimeout(() => {
            this.isTransitioning.next(false);
        }, 50);
    }

    /**
     * Navigate with transition
     */
    navigateWithTransition(route: string | string[], extras?: any): Promise<boolean> {
        this.startTransition();

        const navigationPromise = Array.isArray(route)
            ? this.router.navigate(route, extras)
            : this.router.navigate([route], extras);

        navigationPromise.finally(() => {
            this.endTransition();
        });

        return navigationPromise;
    }

    /**
     * Get transition class based on direction
     */
    getTransitionClass(): string {
        const direction = this.transitionDirection.value;
        const isTransitioning = this.isTransitioning.value;

        if (!isTransitioning) {
            return '';
        }

        switch (direction) {
            case 'forward':
                return 'page-slide-enter';
            case 'backward':
                return 'page-slide-exit';
            default:
                return 'page-transition-enter';
        }
    }

    /**
     * Apply fade transition to element
     */
    applyFadeTransition(element: HTMLElement, duration = 300): Promise<void> {
        return new Promise((resolve) => {
            element.style.transition = `opacity ${duration}ms ease-out`;
            element.style.opacity = '0';

            setTimeout(() => {
                element.style.opacity = '1';
                setTimeout(() => {
                    element.style.transition = '';
                    resolve();
                }, duration);
            }, 50);
        });
    }

    /**
     * Apply slide transition to element
     */
    applySlideTransition(
        element: HTMLElement,
        direction: 'up' | 'down' | 'left' | 'right' = 'up',
        duration = 300
    ): Promise<void> {
        return new Promise((resolve) => {
            const transforms = {
                up: 'translateY(20px)',
                down: 'translateY(-20px)',
                left: 'translateX(20px)',
                right: 'translateX(-20px)'
            };

            element.style.transition = `all ${duration}ms ease-out`;
            element.style.opacity = '0';
            element.style.transform = transforms[direction];

            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'translate(0, 0)';

                setTimeout(() => {
                    element.style.transition = '';
                    element.style.transform = '';
                    resolve();
                }, duration);
            }, 50);
        });
    }

    /**
     * Apply scale transition to element
     */
    applyScaleTransition(element: HTMLElement, duration = 300): Promise<void> {
        return new Promise((resolve) => {
            element.style.transition = `all ${duration}ms ease-out`;
            element.style.opacity = '0';
            element.style.transform = 'scale(0.95)';

            setTimeout(() => {
                element.style.opacity = '1';
                element.style.transform = 'scale(1)';

                setTimeout(() => {
                    element.style.transition = '';
                    element.style.transform = '';
                    resolve();
                }, duration);
            }, 50);
        });
    }

    /**
     * Stagger animations for multiple elements
     */
    staggerAnimations(
        elements: HTMLElement[],
        animationType: 'fade' | 'slide' | 'scale' = 'fade',
        staggerDelay = 100,
        duration = 300
    ): Promise<void[]> {
        const animations = elements.map((element, index) => {
            return new Promise<void>((resolve) => {
                setTimeout(() => {
                    let animationPromise: Promise<void>;

                    switch (animationType) {
                        case 'slide':
                            animationPromise = this.applySlideTransition(element, 'up', duration);
                            break;
                        case 'scale':
                            animationPromise = this.applyScaleTransition(element, duration);
                            break;
                        default:
                            animationPromise = this.applyFadeTransition(element, duration);
                            break;
                    }

                    animationPromise.then(resolve);
                }, index * staggerDelay);
            });
        });

        return Promise.all(animations);
    }

    /**
     * Create loading transition effect
     */
    createLoadingTransition(container: HTMLElement): {
        start: () => void;
        stop: () => void;
    } {
        let isLoading = false;
        let loadingElement: HTMLElement | null = null;

        const start = () => {
            if (isLoading) return;

            isLoading = true;
            loadingElement = document.createElement('div');
            loadingElement.className = 'loading-overlay';
            loadingElement.innerHTML = `
        <div class="loading-spinner"></div>
      `;

            loadingElement.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(255, 255, 255, 0.8);
        backdrop-filter: blur(4px);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 200ms ease-out;
      `;

            container.style.position = 'relative';
            container.appendChild(loadingElement);
        };

        const stop = () => {
            if (!isLoading || !loadingElement) return;

            loadingElement.style.animation = 'fadeOut 200ms ease-out';
            setTimeout(() => {
                if (loadingElement && loadingElement.parentNode) {
                    loadingElement.parentNode.removeChild(loadingElement);
                }
                isLoading = false;
                loadingElement = null;
            }, 200);
        };

        return { start, stop };
    }
}