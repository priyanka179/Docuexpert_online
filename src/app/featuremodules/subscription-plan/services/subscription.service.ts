import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  buy(data: any) {
    return this.http.post("/payment/session/", data);
  }

  getStripePublishKey(){
    return this.http.get('/payment/config/')
  }

}
