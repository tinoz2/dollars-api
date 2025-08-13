import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { GET_DOLLARS_API, GET_DOLLARS_YESTERDAY_API } from '../../config/api';
import { DollarType, DollarYesterday } from '../../models/dollars.model';

@Injectable({
  providedIn: 'root'
})
export class DollarsService {

  private http = inject(HttpClient);

  private dollarsYesterday = signal<DollarYesterday[]>([]);
  private dollarsTypes = signal<DollarType[]>([]);
  private error = signal<string>('');
  private loading = signal<boolean>(false);

  _error = this.error.asReadonly();
  _loading = this.loading.asReadonly();
  _dollarsTypes = this.dollarsTypes.asReadonly();
  _dollarsYesterday = this.dollarsYesterday.asReadonly();

  getDollars() {
    this.loading.set(true);

    this.http.get<DollarType[]>(GET_DOLLARS_API).subscribe({
      next: (data) => {
        this.dollarsTypes.set(data)
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(error.error.message);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    })
  }

  getYesterdayDollars() {
    this.loading.set(true);
    this.http.get<DollarYesterday[]>(GET_DOLLARS_YESTERDAY_API).subscribe({
      next: (data) => {
        this.dollarsYesterday.set(data)
        this.loading.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.error.set(error.error.message);
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    })
  }
}