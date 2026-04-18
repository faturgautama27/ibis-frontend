import {
    Directive,
    ElementRef,
    Input,
    OnInit,
    OnDestroy,
    Renderer2,
    HostListener
} from '@angular/core';

/**
 * Hover Effects Directive
 * Provides smooth hover animations and interactions for elements
 * 
 * Usage:
 * <div appHoverEffects="lift">Content</div>
 * <button appHoverEffects="glow" [hoverScale]="1.05">Button</button>
 * <div appHoverEffects="brightness" [hoverDuration]="200">Card</div>
 */
@Directive({
    selector: '[appHoverEffects]',
    standalone: true
})
export class HoverEffectsDirective implements OnInit, OnDestroy {
    @Input('appHoverEffects') effectType: string = 'lift';
    @Input() hoverDuration: number = 200;
    @Input() hoverScale: number = 1.02;
    @Input() hoverLift: number = 2;
    @Input() hoverGlow: string = 'rgba(14, 165, 233, 0.3)';
    @Input() hoverBrightness: number = 1.1;
    @Input() hoverRotation: number = 2;
    @Input() disabled: boolean = false;

    private originalStyles: { [key: string]: string } = {};
    private isHovering = false;

    constructor(
        private elementRef: ElementRef,
        private renderer: Renderer2
    ) { }

    ngOnInit(): void {
        this.setupElement();
        this.storeOriginalStyles();
    }

    ngOnDestroy(): void {
        // Cleanup is handled automatically by Angular
    }

    private setupElement(): void {
        const element = this.elementRef.nativeElement;

        // Set base transition
        this.renderer.setStyle(
            element,
            'transition',
            `all ${this.hoverDuration}ms ease-out`
        );

        // Ensure element is positioned for transform effects
        const position = window.getComputedStyle(element).position;
        if (position === 'static') {
            this.renderer.setStyle(element, 'position', 'relative');
        }

        // Add cursor pointer for interactive elements
        if (this.isInteractiveElement(element)) {
            this.renderer.setStyle(element, 'cursor', 'pointer');
        }
    }

    private storeOriginalStyles(): void {
        const element = this.elementRef.nativeElement;
        const computedStyles = window.getComputedStyle(element);

        this.originalStyles = {
            transform: computedStyles.transform,
            boxShadow: computedStyles.boxShadow,
            filter: computedStyles.filter,
            opacity: computedStyles.opacity,
            borderColor: computedStyles.borderColor,
            backgroundColor: computedStyles.backgroundColor
        };
    }

    private isInteractiveElement(element: HTMLElement): boolean {
        const interactiveTags = ['button', 'a', 'input', 'select', 'textarea'];
        const interactiveRoles = ['button', 'link', 'tab', 'menuitem'];

        return interactiveTags.includes(element.tagName.toLowerCase()) ||
            interactiveRoles.includes(element.getAttribute('role') || '') ||
            element.hasAttribute('onclick') ||
            element.classList.contains('interactive');
    }

    @HostListener('mouseenter')
    onMouseEnter(): void {
        if (this.disabled) return;

        this.isHovering = true;
        this.applyHoverEffect();
    }

    @HostListener('mouseleave')
    onMouseLeave(): void {
        if (this.disabled) return;

        this.isHovering = false;
        this.removeHoverEffect();
    }

    @HostListener('mousedown')
    onMouseDown(): void {
        if (this.disabled) return;

        this.applyPressEffect();
    }

    @HostListener('mouseup')
    onMouseUp(): void {
        if (this.disabled) return;

        if (this.isHovering) {
            this.applyHoverEffect();
        } else {
            this.removeHoverEffect();
        }
    }

    private applyHoverEffect(): void {
        const element = this.elementRef.nativeElement;

        switch (this.effectType) {
            case 'lift':
                this.applyLiftEffect(element);
                break;
            case 'scale':
                this.applyScaleEffect(element);
                break;
            case 'glow':
                this.applyGlowEffect(element);
                break;
            case 'brightness':
                this.applyBrightnessEffect(element);
                break;
            case 'rotate':
                this.applyRotateEffect(element);
                break;
            case 'border':
                this.applyBorderEffect(element);
                break;
            case 'background':
                this.applyBackgroundEffect(element);
                break;
            case 'shadow':
                this.applyShadowEffect(element);
                break;
            case 'float':
                this.applyFloatEffect(element);
                break;
            case 'tilt':
                this.applyTiltEffect(element);
                break;
            default:
                this.applyLiftEffect(element);
                break;
        }
    }

    private removeHoverEffect(): void {
        const element = this.elementRef.nativeElement;

        // Reset to original styles
        this.renderer.setStyle(element, 'transform', this.originalStyles['transform']);
        this.renderer.setStyle(element, 'box-shadow', this.originalStyles['boxShadow']);
        this.renderer.setStyle(element, 'filter', this.originalStyles['filter']);
        this.renderer.setStyle(element, 'border-color', this.originalStyles['borderColor']);
        this.renderer.setStyle(element, 'background-color', this.originalStyles['backgroundColor']);
    }

    private applyPressEffect(): void {
        const element = this.elementRef.nativeElement;

        // Temporarily reduce scale for press effect
        const currentTransform = element.style.transform || '';
        const pressScale = this.hoverScale * 0.95;

        if (this.effectType === 'lift' || this.effectType === 'float') {
            this.renderer.setStyle(
                element,
                'transform',
                `translateY(${this.hoverLift / 2}px) scale(${pressScale})`
            );
        } else {
            this.renderer.setStyle(
                element,
                'transform',
                `scale(${pressScale})`
            );
        }
    }

    private applyLiftEffect(element: HTMLElement): void {
        this.renderer.setStyle(
            element,
            'transform',
            `translateY(-${this.hoverLift}px) scale(${this.hoverScale})`
        );
        this.renderer.setStyle(
            element,
            'box-shadow',
            '0 10px 25px rgba(0, 0, 0, 0.15)'
        );
    }

    private applyScaleEffect(element: HTMLElement): void {
        this.renderer.setStyle(
            element,
            'transform',
            `scale(${this.hoverScale})`
        );
    }

    private applyGlowEffect(element: HTMLElement): void {
        this.renderer.setStyle(
            element,
            'box-shadow',
            `0 0 20px ${this.hoverGlow}`
        );
    }

    private applyBrightnessEffect(element: HTMLElement): void {
        this.renderer.setStyle(
            element,
            'filter',
            `brightness(${this.hoverBrightness})`
        );
    }

    private applyRotateEffect(element: HTMLElement): void {
        this.renderer.setStyle(
            element,
            'transform',
            `rotate(${this.hoverRotation}deg) scale(${this.hoverScale})`
        );
    }

    private applyBorderEffect(element: HTMLElement): void {
        this.renderer.setStyle(
            element,
            'border-color',
            'var(--primary-500)'
        );
        this.renderer.setStyle(
            element,
            'box-shadow',
            '0 0 0 2px rgba(14, 165, 233, 0.2)'
        );
    }

    private applyBackgroundEffect(element: HTMLElement): void {
        this.renderer.setStyle(
            element,
            'background-color',
            'var(--primary-50)'
        );
    }

    private applyShadowEffect(element: HTMLElement): void {
        this.renderer.setStyle(
            element,
            'box-shadow',
            '0 8px 25px rgba(0, 0, 0, 0.15)'
        );
    }

    private applyFloatEffect(element: HTMLElement): void {
        this.renderer.setStyle(
            element,
            'transform',
            `translateY(-${this.hoverLift * 2}px)`
        );
        this.renderer.setStyle(
            element,
            'box-shadow',
            '0 15px 35px rgba(0, 0, 0, 0.1)'
        );
    }

    private applyTiltEffect(element: HTMLElement): void {
        this.renderer.setStyle(
            element,
            'transform',
            `perspective(1000px) rotateX(${this.hoverRotation}deg) rotateY(${this.hoverRotation}deg)`
        );
    }

    /**
     * Public method to enable/disable effects
     */
    public setDisabled(disabled: boolean): void {
        this.disabled = disabled;

        if (disabled && this.isHovering) {
            this.removeHoverEffect();
        }
    }

    /**
     * Public method to trigger hover effect programmatically
     */
    public triggerHover(): void {
        if (!this.disabled) {
            this.applyHoverEffect();
        }
    }

    /**
     * Public method to remove hover effect programmatically
     */
    public removeHover(): void {
        this.removeHoverEffect();
    }
}