import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { trigger, state, style, animate, transition } from '@angular/animations';

import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/timer';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/filter';


class QueryModel {
  lpnOrMobile: string;
}

export class Notice {
  constructor(
      public id: number,
      public lpn: string,
      public dateModified: Date,
      public status: string,
      public animationState?: string
  ) { }
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.styl'],
  animations: [
    trigger('noticeAnimationState',[
      state('in', style({transform: 'translateY(0)'})),
      transition('void => *', [
        style({transform: 'translateY(-100%)'}),
        animate(100)
      ])
    ])
  ]
})
export class AppComponent implements OnInit {

  model = new QueryModel();
  notices: Notice[] = [];
  interval = 10; // 10 seconds 
  countdown = 0;
  loading = false;

  subscription: Subscription;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit(): void {
  }

  onFormSubmit() {
    if (this.subscription != null && !this.subscription.closed) {
      this.subscription.unsubscribe();
    }
    this.notices = [];
    this.countdown = 0;
    this.loading = true;


    this.subscription = this.pollNotices(this.model.lpnOrMobile, Math.max.apply(Math, this.notices.map(x => x.id)))
      .subscribe(
        (ns) => {
          ns.forEach(x => {
            this.notices.unshift(x);
            x.animationState = 'in';
          });
        }
      );
  }

  private pollNotices(lpnOrMobile: string, maxId: number = 0): Observable<Notice[]> {
    let lastMaxId = Number.isInteger(maxId) ? maxId : 0;
    //console.log(lastMaxId);

    return Observable.timer(0, 1000)
      .map(
        () => {
          this.countdown--;
          if(this.countdown <= 0){ 
            this.countdown = this.interval;
          }
          return this.countdown;
      })
      .filter(c => c == this.interval)
      .switchMap(
        () => this.http.post<Notice[]>(`/api/GetNewer`, { lpnOrMobile: lpnOrMobile, maxId: lastMaxId })
      )
      .do(
        (ns) => {
          let retMaxId = Math.max.apply(Math, ns.map(x => x.id));
          lastMaxId = Math.max(retMaxId, lastMaxId);
        }
      );
  }
}
