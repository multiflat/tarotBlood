import {
  Component,
  AfterViewInit,
  OnDestroy,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  NgZone,
} from "@angular/core";
import {
  GestureController,
  Gesture,
  GestureConfig,
  AnimationController,
  Animation,
} from "@ionic/angular";
import { Card } from "../../../interfaces/card";

declare var ResizeObserver;

@Component({
  selector: "app-card",
  templateUrl: "./card.component.html",
  styleUrls: ["./card.component.scss"],
})
export class CardComponent implements AfterViewInit, OnDestroy {
  @Input("card") card: Card;
  @Output("watched") watched: EventEmitter<any> = new EventEmitter();
  @Output("selectCard") selectCard: EventEmitter<any> = new EventEmitter();

  private gesture: Gesture = null;

  private started: string = "none";
  private swipeRightAnimation: Animation = null;
  private swipeLeftAnimation: Animation = null;

  constructor(
    private hostElement: ElementRef,
    private gestureCtrl: GestureController,
    private animationCtrl: AnimationController,
    private zone: NgZone
  ) {}

  ngAfterViewInit() {
    const resizeObserver = new ResizeObserver(() => {
      this.init();
    });

    resizeObserver.observe(this.hostElement.nativeElement);
  }

  ngOnDestroy() {
    this.gesture.destroy();
  }

  async showNextCard(){
    this.gesture.enable(false);
    await this.swipeLeftAnimation.play();
    this.gesture.enable(true);
    this.alreadyWatched();
  }

  init() {
    if (this.swipeRightAnimation !== null && this.swipeLeftAnimation !== null) {
      this.swipeLeftAnimation.destroy();
      this.swipeRightAnimation.destroy();
    }

    if (this.gesture !== null) {
      this.gesture.destroy();
    }

    const windowWidth = window.innerWidth;

    this.swipeRightAnimation = this.animationCtrl
      .create()
      .addElement(this.hostElement.nativeElement)
      .duration(400)
      .easing("ease-in")
      .fromTo(
        "transform",
        "translateX(0) rotate(0)",
        `translateX(${windowWidth * 1.75}px) rotate(45deg)`
      );

    this.swipeLeftAnimation = this.animationCtrl
      .create()
      .addElement(this.hostElement.nativeElement)
      .duration(400)
      .easing("ease-in")
      .fromTo(
        "transform",
        "translateX(0) rotate(0)",
        `translateX(-${windowWidth * 1.75}px) rotate(-45deg)`
      );

    const options: GestureConfig = {
      el: this.hostElement.nativeElement,
      threshold: 10, // Make sure not to trigger on button clicks
      gestureName: "swipe", ///////########
      canStart: () => {
        return this.started === "none";
      },
      onStart: () => {},
      onMove: (ev) => {
        if (ev.deltaX >= 0) {
          if (this.started === "left") {
            this.swipeLeftAnimation.stop();
          }

          if (this.started !== "right") {
            this.started = "right";
            this.swipeRightAnimation.progressStart(false, 0);
          }

          this.swipeRightAnimation.progressStep(this.getStep(ev, windowWidth));
        } else {
          if (this.started === "right") {
            this.swipeRightAnimation.stop();
          }

          if (this.started !== "left") {
            this.started = "left";
            this.swipeLeftAnimation.progressStart(false, 0);
          }

          this.swipeLeftAnimation.progressStep(this.getStep(ev, windowWidth));
        }
      },
      onEnd: (ev) => {
        const step = this.getStep(ev, windowWidth);
        const shouldComplete = step > 0.6;
        const resetDuration = 300;

        if (ev.deltaX >= 0) {
          this.swipeRightAnimation.progressEnd(shouldComplete ? 1 : 0, step, resetDuration);

          if (shouldComplete) {
            this.alreadyWatched();
          } else {
            setTimeout(() => {
              this.swipeRightAnimation.stop();
              this.started = "none";
            }, resetDuration);
          }
        } else {
          this.swipeLeftAnimation.progressEnd(shouldComplete ? 1 : 0, step, resetDuration);

          if (shouldComplete) {
            this.alreadyWatched();
          } else {
            setTimeout(() => {
              this.swipeLeftAnimation.stop();
              this.started = "none";
            }, resetDuration);
          }
        }
      },
    };

    this.gesture = this.gestureCtrl.create(options);
    this.gesture.enable();
  }

  getStep(ev, maxWidth) {
    return this.clamp(0, Math.abs(ev.deltaX) / maxWidth, 1);
  }

  clamp(min, value, max) {
    return Math.max(min, Math.min(value, max));
  }

  alreadyWatched() {
    setTimeout(() => {
      this.zone.run(() => {
        this.watched.emit(this.card);
      });
    }, 300);
  }

  selectCardEmit() {
    setTimeout(() => {
      this.zone.run(() => {
        this.selectCard.emit(this.card);
      });
    }, 300);
  }
}
