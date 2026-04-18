import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    OnDestroy,
    Renderer2,
    AfterViewInit
} from '@angular/core';

/**
 * Animation Directive
 * Provides easy-to-use animation capabilities for any element
 * 
 * Usage:
 * <div appAnimate="fadeIn" [animateDelay]="200" [animateDuration]="300">Content</div>
 * <div appAnimate="slideUp" animateOnHover="true">Hover me</div>
 * <div appAnimate="scaleIn" animateOnVisible="true">Scroll to see</div>
 */
@Directive({
    selector: '[appAnimate]',
    standalone: true
})
export class AnimateDirective implements OnInit, AfterViewInit, OnDestroy {
    @Input('appAnimate') animationType: string = 'fadeIn';
    @Input() animateDelay: number = 0;
    @Input() animateDuration: number = 300;
    @Input() animateOnHover: boolean = false;
    @Input() animateOnVisible: boolean = false;
    @Input() animateOnClick: boolean = false;
    @Input() animateRepeat: boolean = false;
    @Input() animateEasing: string = 'ease-out';

    private observer?: IntersectionObserver;
    private hasAnimated = false;
    private hoverListeners: (() => void)[] = [];
    private clickListener?: () => void;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.setupInitialState();
    }

    ngAfterViewInit(): void {
        if (this.animateOnVisible) {
            this.setupIntersectionObserver();
        } else if (!this.animateOnHover && !this.animateOnClick) {
            this.startAnimation();
        }

        if (this.animateOnHover) {
            this.setupHoverAnimation();
        }

        if (this.animateOnClick) {
            this.setupClickAnimation();
        }
    }

    ngOnDestroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }

        this.hoverListeners.forEach(unlisten => unlisten());

        if (this.clickListener) {
            this.clickListener();
        }
    }

    private setupInitialState(): void {
        const element = this.elementRef.nativeElement;

        // Set initial state based on animation type
        switch (this.animationType) {
            case 'fadeIn':
            case 'fadeInUp':
            case 'fadeInDown':
            case 'fadeInLeft':
            case 'fadeInRight':
                this.renderer.setStyle(element, 'opacity', '0');
                break;
            case 'slideUp':
                this.renderer.setStyle(element, 'opacity', '0');
                this.renderer.setStyle(element, 'transform', 'translateY(20px)');
                break;
            case 'slideDown':
                this.renderer.setStyle(element, 'opacity', '0');
                this.renderer.setStyle(element, 'transform', 'translateY(-20px)');
                break;
            case 'slideLeft':
                this.renderer.setStyle(element, 'opacity', '0');
                this.renderer.setStyle(element, 'transform', 'translateX(20px)');
                break;
            case 'slideRight':
                this.renderer.setStyle(element, 'opacity', '0');
                this.renderer.setStyle(element, 'transform', 'translateX(-20px)');
                break;
            case 'scaleIn':
                this.renderer.setStyle(element, 'opacity', '0');
                this.renderer.setStyle(element, 'transform', 'scale(0.9)');
                break;
            case 'bounceIn':
                this.renderer.setStyle(element, 'opacity', '0');
                this.renderer.setStyle(element, 'transform', 'scale(0.3)');
                break;
        }

        // Set transition properties
        this.renderer.setStyle(
            element,
            'transition',
            `all ${this.animateDuration}ms ${this.animateEasing}`
        );
    }

    private setupIntersectionObserver(): void {
        const options = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && (!this.hasAnimated || this.animateRepeat)) {
                    setTimeout(() => {
                        this.startAnimation();
                    }, this.animateDelay);
                }
            });
        }, options);

        this.observer.observe(this.elementRef.nativeElement);
    }

    private setupHoverAnimation(): void {
        const element = this.elementRef.nativeElement;

        const mouseEnterListener = this.renderer.listen(element, 'mouseenter', () => {
            this.startAnimation();
        });

        const mouseLeaveListener = this.renderer.listen(element, 'mouseleave', () => {
            if (this.animateRepeat) {
                this.resetAnimation();
            }
        });

        this.hoverListeners.push(mouseEnterListener, mouseLeaveListener);
    }

    private setupClickAnimation(): void {
        const element = this.elementRef.nativeElement;

        this.clickListener = this.renderer.listen(element, 'click', () => {
            if (this.animateRepeat || !this.hasAnimated) {
                this.startAnimation();
            }
        });
    }

    private startAnimation(): void {
        const element = this.elementRef.nativeElement;
        this.hasAnimated = true;

        // Apply animation based on type
        switch (this.animationType) {
            case 'fadeIn':
                this.renderer.setStyle(element, 'opacity', '1');
                break;

            case 'fadeInUp':
                this.renderer.setStyle(element, 'opacity', '1');
                this.renderer.setStyle(element, 'transform', 'translateY(0)');
                break;

            case 'fadeInDown':
                this.renderer.setStyle(element, 'opacity', '1');
                this.renderer.setStyle(element, 'transform', 'translateY(0)');
                break;

            case 'fadeInLeft':
                this.renderer.setStyle(element, 'opacity', '1');
                this.renderer.setStyle(element, 'transform', 'translateX(0)');
                break;

            case 'fadeInRight':
                this.renderer.setStyle(element, 'opacity', '1');
                this.renderer.setStyle(element, 'transform', 'translateX(0)');
                break;

            case 'slideUp':
            case 'slideDown':
            case 'slideLeft':
            case 'slideRight':
                this.renderer.setStyle(element, 'opacity', '1');
                this.renderer.setStyle(element, 'transform', 'translate(0, 0)');
                break;

            case 'scaleIn':
                this.renderer.setStyle(element, 'opacity', '1');
                this.renderer.setStyle(element, 'transform', 'scale(1)');
                break;

            case 'bounceIn':
                this.renderer.setStyle(element, 'opacity', '1');
                this.animateBounce(element);
                break;

            case 'pulse':
                this.animatePulse(element);
                break;

            case 'shake':
                this.animateShake(element);
                break;

            case 'rotate':
                this.animateRotate(element);
                break;

            case 'flip':
                this.animateFlip(element);
                break;

            default:
                // Custom animation class
                this.renderer.addClass(element, this.animationType);
                break;
        }

        // Add completion callback
        setTimeout(() => {
            this.onAnimationComplete();
        }, this.animateDuration);
    }

    private resetAnimation(): void {
        this.hasAnimated = false;
        this.setupInitialState();
    }

    private animateBounce(element: HTMLElement): void {
        const keyframes = [
            { transform: 'scale(0.3)', opacity: '0', offset: 0 },
            { transform: 'scale(1.05)', opacity: '1', offset: 0.5 },
            { transform: 'scale(0.9)', opacity: '1', offset: 0.7 },
            { transform: 'scale(1)', opacity: '1', offset: 1 }
        ];

        element.animate(keyframes, {
            duration: this.animateDuration,
            easing: this.animateEasing,
            fill: 'forwards'
        });
    }

    private animatePulse(element: HTMLElement): void {
        const keyframes = [
            { opacity: '1', offset: 0 },
            { opacity: '0.5', offset: 0.5 },
            { opacity: '1', offset: 1 }
        ];

        const animation = element.animate(keyframes, {
            duration: this.animateDuration,
            easing: this.animateEasing,
            iterations: this.animateRepeat ? Infinity : 1
        });

        if (!this.animateRepeat) {
            animation.addEventListener('finish', () => {
                this.onAnimationComplete();
            });
        }
    }

    private animateShake(element: HTMLElement): void {
        const keyframes = [
            { transform: 'translateX(0)', offset: 0 },
            { transform: 'translateX(-2px)', offset: 0.1 },
            { transform: 'translateX(2px)', offset: 0.2 },
            { transform: 'translateX(-2px)', offset: 0.3 },
            { transform: 'translateX(2px)', offset: 0.4 },
            { transform: 'translateX(-2px)', offset: 0.5 },
            { transform: 'translateX(2px)', offset: 0.6 },
            { transform: 'translateX(-2px)', offset: 0.7 },
            { transform: 'translateX(2px)', offset: 0.8 },
            { transform: 'translateX(-2px)', offset: 0.9 },
            { transform: 'translateX(0)', offset: 1 }
        ];

        element.animate(keyframes, {
            duration: 500,
            easing: 'ease-in-out',
            fill: 'forwards'
        });
    }

    private animateRotate(element: HTMLElement): void {
        const keyframes = [
            { transform: 'rotate(0deg)', offset: 0 },
            { transform: 'rotate(360deg)', offset: 1 }
        ];

        element.animate(keyframes, {
            duration: this.animateDuration,
            easing: this.animateEasing,
            fill: 'forwards'
        });
    }

    private animateFlip(element: HTMLElement): void {
        const keyframes = [
            { transform: 'rotateY(0deg)', offset: 0 },
            { transform: 'rotateY(180deg)', offset: 0.5 },
            { transform: 'rotateY(360deg)', offset: 1 }
        ];

        element.animate(keyframes, {
            duration: this.animateDuration,
            easing: this.animateEasing,
            fill: 'forwards'
        });
    }

    private onAnimationComplete(): void {
        const element = this.elementRef.nativeElement;

        // Clean up transition styles
        this.renderer.removeStyle(element, 'transition');

        // Add completed class for styling hooks
        this.renderer.addClass(element, 'animation-complete');

        // Dispatch custom event
        const event = new CustomEvent('animationComplete', {
            detail: { animationType: this.animationType }
        });
        element.dispatchEvent(event);
    }

    /**
     * Public method to trigger animation programmatically
     */
    public animate(): void {
        if (this.animateRepeat || !this.hasAnimated) {
            this.startAnimation();
        }
    }

    /**
     * Public method to reset animation state
     */
    public reset(): void {
        this.resetAnimation();
    }
}