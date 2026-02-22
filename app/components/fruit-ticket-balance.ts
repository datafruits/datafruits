import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

interface FruitTicketBalanceArgs {
  value: number;
}

const ANIMATION_DURATION = 5000;
const SCALE_ANIMATION_DURATION = 600;

export default class FruitTicketBalanceComponent extends Component<FruitTicketBalanceArgs> {
  @tracked displayedValue: number = this.args.value ?? 0;
  @tracked isAnimating = false;

  private animationId: number | null = null;
  private scaleAnimationTimeoutId: number | null = null;
  private animationStart: number | null = null;
  private animationFrom: number = this.args.value ?? 0;
  private animationTo: number = this.args.value ?? 0;

  @action
  onUpdate(): void {
    const newValue = this.args.value ?? 0;
    if (newValue > this.animationTo) {
      this.startAnimation(this.displayedValue, newValue);
    } else {
      this.cancelAnimation();
      this.displayedValue = newValue;
      this.animationTo = newValue;
      this.animationFrom = newValue;
    }
  }

  private startAnimation(from: number, to: number): void {
    console.log("starting animation");
    this.cancelAnimation();
    this.animationFrom = from;
    this.animationTo = to;
    this.animationStart = null;
    this.isAnimating = true;

    if (this.scaleAnimationTimeoutId !== null) {
      window.clearTimeout(this.scaleAnimationTimeoutId);
    }
    this.scaleAnimationTimeoutId = window.setTimeout(() => {
      this.isAnimating = false;
      this.scaleAnimationTimeoutId = null;
    }, SCALE_ANIMATION_DURATION);

    const step = (timestamp: number): void => {
      if (this.animationStart === null) {
        this.animationStart = timestamp;
      }
      const elapsed = timestamp - this.animationStart;
      const progress = Math.min(elapsed / ANIMATION_DURATION, 1);
      // ease-out cubic: 1 - (1 - t)^3 for a smoother deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      this.displayedValue = Math.round(
        this.animationFrom + (this.animationTo - this.animationFrom) * eased
      );

      if (progress < 1) {
        this.animationId = requestAnimationFrame(step);
      } else {
        this.displayedValue = this.animationTo;
        this.animationId = null;
      }
    };

    this.animationId = requestAnimationFrame(step);
  }

  private cancelAnimation(): void {
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  willDestroy(): void {
    super.willDestroy();
    this.cancelAnimation();
    if (this.scaleAnimationTimeoutId !== null) {
      window.clearTimeout(this.scaleAnimationTimeoutId);
    }
  }
}

declare module '@glint/environment-ember-loose/registry' {
  export default interface Registry {
    FruitTicketBalance: typeof FruitTicketBalanceComponent;
  }
}
