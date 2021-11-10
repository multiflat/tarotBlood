import { AfterViewInit, AfterViewChecked, Component, ElementRef, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
})
export class InfoPage implements AfterViewChecked,OnDestroy {
  @ViewChild(IonContent, { read: IonContent, static: false }) content: IonContent;
  @ViewChild('summer') summer: any;
  @ViewChild('autumn') autumn: any;

  constructor(private activeRoute: ActivatedRoute, ) { }
  ngAfterViewChecked(): void {// ngAfterViewInit가 아님!!!!!!
    this.activeRoute.params.subscribe(param => { // home html에서 summer 부분을 각 카드에 맞게 동적으로 변화하게 수정해야함.
        if(param.pageSec == 'summer'){
          console.log("it's summer");
          this.content.scrollToPoint(0, this.summer.nativeElement.offsetTop - 30, 1000);
        } else if(param.pageSec == 'autumn'){
          this.content.scrollToPoint(0, this.autumn.nativeElement.offsetTop - 30, 1000);
          console.log("it's autumn");
        } //divs 처리 관련 텔레그램 스크랩 살피기.

        // const rect = this.summer.getBoundingClientRect()// 텔레그램에 스크랩한 부분 살피기.
        // console.log(rect);
       
        //this.content.scrollToPoint(0, section.nativeElement.offsetTop, 1000);
        
     
    })

  }
  ngOnDestroy(){}//ngAfterViewInit 사용 주의사항 더 알아볼 것!!!
}