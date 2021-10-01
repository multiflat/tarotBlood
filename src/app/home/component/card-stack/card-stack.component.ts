import {
  Component,
  AfterViewInit,
  ContentChildren,
  QueryList,
  Output,
  EventEmitter,
} from "@angular/core";
import { CardComponent } from "../card/card.component";

@Component({
  selector: "app-card-stack",
  templateUrl: "./card-stack.component.html",
  styleUrls: ["./card-stack.component.scss"],
})
export class CardStackComponent implements AfterViewInit {
  @Output("infinite") infinite: EventEmitter<any> = new EventEmitter();
  @ContentChildren(CardComponent) cards: QueryList<CardComponent>;
  public loading: boolean = false;

  constructor() {}

  ngAfterViewInit() {
    this.cards.changes.subscribe(() => {
      if (this.cards.length === 0) {
        this.loading = true;
        this.infinite.emit(() => this.complete);
      }
    });
  }

  complete() {
    this.loading = false;
  }
}
