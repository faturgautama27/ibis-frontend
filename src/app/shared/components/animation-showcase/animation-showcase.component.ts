import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DialogModule } from 'primeng/dialog';

// Import our animation directives and services
import { AnimateDirective } from '../../directives/animate.directive';
import { HoverEffectsDirective } from '../../directives/hover-effects.directive';
import { PageTransitionService } from '../../services/page-transition.service';
import { EnhancedButtonComponent } from '../enhanced-button/enhanced-button.component';
import { EnhancedCardComponent } from '../enhanced-card/enhanced-card.component';
import { EnhancedModalComponent } from '../enhanced-modal/enhanced-modal.component';

/**
 * Animation Showcase Component
 * Demonstrates all animation and interaction features implemented in Task 5
 * 
 * Requirements: 9.1-9.8, 10.1-10.6 - Animation and interaction implementation
 */
@Component({
  selector: 'app-animation-showcase',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    SelectModule,
    DialogModule,
    AnimateDirective,
    HoverEffectsDirective,
    EnhancedButtonComponent,
    EnhancedCardComponent,
    EnhancedModalComponent
  ],
  template: `
    <div class="animation-showcase">
      <div class="showcase-header" appAnimate="fadeInDown" [animateDelay]="100">
        <h1>Animation & Interaction Showcase</h1>
        <p>Demonstrating smooth animations and micro-interactions for enhanced user experience</p>
      </div>

      <!-- Button Animations Section -->
      <section class="showcase-section" appAnimate="fadeInUp" [animateDelay]="200">
        <h2>Button Animations</h2>
        <div class="button-grid">
          <app-enhanced-button 
            label="Primary Button" 
            variant="primary" 
            [ripple]="true"
            appHoverEffects="lift">
          </app-enhanced-button>

          <app-enhanced-button 
            label="Secondary Button" 
            variant="secondary"
            appHoverEffects="glow">
          </app-enhanced-button>

          <app-enhanced-button 
            label="Danger Button" 
            variant="danger"
            appHoverEffects="scale">
          </app-enhanced-button>

          <app-enhanced-button 
            label="Loading Button" 
            variant="primary"
            [loading]="isLoading"
            (onClick)="toggleLoading()">
          </app-enhanced-button>
        </div>
      </section>

      <!-- Card Animations Section -->
      <section class="showcase-section" appAnimate="fadeInUp" [animateDelay]="300">
        <h2>Card Hover Effects</h2>
        <div class="card-grid">
          <app-enhanced-card 
            variant="standard" 
            title="Lift Effect"
            subtitle="Hover to see lift animation"
            [interactive]="true"
            appHoverEffects="lift">
            <p>This card lifts up on hover with a smooth shadow transition.</p>
          </app-enhanced-card>

          <app-enhanced-card 
            variant="stats" 
            title="Scale Effect"
            subtitle="Hover to see scale animation"
            [interactive]="true"
            appHoverEffects="scale">
            <p>This card scales up slightly on hover for a subtle zoom effect.</p>
          </app-enhanced-card>

          <app-enhanced-card 
            variant="elevated" 
            title="Glow Effect"
            subtitle="Hover to see glow animation"
            [interactive]="true"
            appHoverEffects="glow">
            <p>This card glows with a colored shadow on hover.</p>
          </app-enhanced-card>
        </div>
      </section>

      <!-- Form Animations Section -->
      <section class="showcase-section" appAnimate="fadeInUp" [animateDelay]="400">
        <h2>Form Interactions</h2>
        <div class="form-demo">
          <div class="form-field" appAnimate="slideLeft" [animateDelay]="500">
            <label>Animated Input</label>
            <input 
              type="text" 
              placeholder="Type something..."
              appHoverEffects="border"
              class="form-input">
          </div>

          <div class="form-field" appAnimate="slideLeft" [animateDelay]="600">
            <label>Dropdown with Animation</label>
            <p-select 
              [options]="dropdownOptions"
              optionLabel="label"
              optionValue="value"
              placeholder="Select an option"
              appHoverEffects="lift"
              [hoverLift]="1">
            </p-select>
          </div>
        </div>
      </section>

      <!-- Modal Animation Section -->
      <section class="showcase-section" appAnimate="fadeInUp" [animateDelay]="500">
        <h2>Modal Animations</h2>
        <div class="modal-demo">
          <app-enhanced-button 
            label="Show Animated Modal" 
            variant="primary"
            icon="pi pi-external-link"
            (onClick)="showModal = true"
            appHoverEffects="scale">
          </app-enhanced-button>
        </div>
      </section>

      <!-- Staggered Animations Section -->
      <section class="showcase-section" appAnimate="fadeInUp" [animateDelay]="600">
        <h2>Staggered Animations</h2>
        <div class="stagger-demo">
          <div 
            *ngFor="let item of staggerItems; let i = index"
            class="stagger-item"
            appAnimate="slideUp"
            [animateDelay]="700 + (i * 100)"
            appHoverEffects="lift">
            <i [class]="item.icon"></i>
            <h4>{{ item.title }}</h4>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </section>

      <!-- Page Transition Section -->
      <section class="showcase-section" appAnimate="fadeInUp" [animateDelay]="800">
        <h2>Page Transitions</h2>
        <div class="transition-demo">
          <app-enhanced-button 
            label="Fade Transition" 
            variant="secondary"
            (onClick)="demoPageTransition('fade')"
            appHoverEffects="brightness">
          </app-enhanced-button>

          <app-enhanced-button 
            label="Slide Transition" 
            variant="secondary"
            (onClick)="demoPageTransition('slide')"
            appHoverEffects="brightness">
          </app-enhanced-button>

          <app-enhanced-button 
            label="Scale Transition" 
            variant="secondary"
            (onClick)="demoPageTransition('scale')"
            appHoverEffects="brightness">
          </app-enhanced-button>
        </div>
      </section>

      <!-- Interactive Elements Section -->
      <section class="showcase-section" appAnimate="fadeInUp" [animateDelay]="900">
        <h2>Interactive Elements</h2>
        <div class="interactive-demo">
          <div 
            class="interactive-box"
            appAnimate="bounceIn"
            [animateDelay]="1000"
            appHoverEffects="rotate"
            [hoverRotation]="5">
            <i class="pi pi-star"></i>
            <span>Rotate on Hover</span>
          </div>

          <div 
            class="interactive-box"
            appAnimate="bounceIn"
            [animateDelay]="1100"
            appHoverEffects="tilt">
            <i class="pi pi-heart"></i>
            <span>Tilt Effect</span>
          </div>

          <div 
            class="interactive-box"
            appAnimate="bounceIn"
            [animateDelay]="1200"
            appHoverEffects="float"
            [hoverLift]="8">
            <i class="pi pi-bolt"></i>
            <span>Float Effect</span>
          </div>
        </div>
      </section>
    </div>

    <!-- Animated Modal -->
    <app-enhanced-modal
      [(visible)]="showModal"
      title="Animated Modal"
      subtitle="Smooth entrance and exit animations"
      headerIcon="pi pi-sparkles"
      size="md"
      [showCustomHeader]="true">
      
      <div class="modal-content" appAnimate="fadeIn" [animateDelay]="200">
        <p>This modal demonstrates smooth entrance and exit animations with backdrop blur effects.</p>
        <p>The content also animates in with a slight delay for a polished feel.</p>
        
        <div class="modal-features" appAnimate="slideUp" [animateDelay]="400">
          <h4>Animation Features:</h4>
          <ul>
            <li>Backdrop fade-in with blur effect</li>
            <li>Modal scale and fade entrance</li>
            <li>Staggered content animations</li>
            <li>Smooth exit transitions</li>
          </ul>
        </div>
      </div>

      <div slot="footer">
        <app-enhanced-button 
          label="Close" 
          variant="secondary"
          (onClick)="showModal = false"
          appHoverEffects="scale">
        </app-enhanced-button>
      </div>
    </app-enhanced-modal>

    <!-- Transition Demo Overlay -->
    <div 
      class="transition-overlay" 
      [class.active]="showTransitionDemo"
      [class.fade]="transitionType === 'fade'"
      [class.slide]="transitionType === 'slide'"
      [class.scale]="transitionType === 'scale'">
      <div class="transition-content">
        <h3>{{ transitionType | titlecase }} Transition Demo</h3>
        <p>This demonstrates a {{ transitionType }} page transition effect.</p>
        <app-enhanced-button 
          label="Close Demo" 
          variant="primary"
          (onClick)="closeTransitionDemo()">
        </app-enhanced-button>
      </div>
    </div>
  `,
  styleUrls: ['./animation-showcase.component.scss']
})
export class AnimationShowcaseComponent implements OnInit {
  isLoading = false;
  showModal = false;
  showTransitionDemo = false;
  transitionType: 'fade' | 'slide' | 'scale' = 'fade';

  dropdownOptions = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' }
  ];

  staggerItems = [
    {
      icon: 'pi pi-palette',
      title: 'Visual Design',
      description: 'Beautiful and consistent visual elements'
    },
    {
      icon: 'pi pi-cog',
      title: 'Smooth Interactions',
      description: 'Responsive and fluid user interactions'
    },
    {
      icon: 'pi pi-mobile',
      title: 'Responsive',
      description: 'Works perfectly on all device sizes'
    },
    {
      icon: 'pi pi-shield',
      title: 'Accessible',
      description: 'Built with accessibility in mind'
    }
  ];

  constructor(private pageTransitionService: PageTransitionService) { }

  ngOnInit(): void {
    // Component initialization
  }

  toggleLoading(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }

  demoPageTransition(type: 'fade' | 'slide' | 'scale'): void {
    this.transitionType = type;
    this.showTransitionDemo = true;
  }

  closeTransitionDemo(): void {
    this.showTransitionDemo = false;
  }
}