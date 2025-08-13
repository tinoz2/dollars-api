import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { CONVERT_CURRENCIES_API, GET_CURRENCIES_API } from '../../config/api';
import { ConvertData } from '../../models/convert-data.model';
import { CurrencyData } from '../../models/currency.model';

@Injectable({
  providedIn: 'root'
})
export class CurrenciesService {

  private http = inject(HttpClient);

  private currencies = signal<CurrencyData[]>([{
    code: '',
    name: '',
    decimal_digits: 0,
    name_plural: '',
    rounding: 0,
    symbol: '',
    symbol_native: ''
  }]);
  private currencyFromConvert = signal<CurrencyData>({
    code: 'ARS',
    name: 'Argentine peso',
    decimal_digits: 2,
    name_plural: 'Argentine pesos',
    rounding: 0,
    symbol: 'AR$',
    symbol_native: '$'
  });
  private currencyToConvert = signal<CurrencyData>({
    code: 'USD',
    name: 'US Dollar',
    decimal_digits: 2,
    name_plural: 'US dollars',
    rounding: 0,
    symbol: '$',
    symbol_native: '$'
  });

  private error = signal<string>('');
  private loading = signal<boolean>(false);
  private result = signal<number>(0);

  _currencies = this.currencies.asReadonly();
  _currencyFromConvert = this.currencyFromConvert.asReadonly();
  _currencyToConvert = this.currencyToConvert.asReadonly();

  _result = this.result.asReadonly();
  _error = this.error.asReadonly();
  _loading = this.loading.asReadonly();

  getCurrencies(){
    this.loading.set(true)

    this.http.get<Record<string, CurrencyData>>(GET_CURRENCIES_API).subscribe({
      next: (data) => {
        const arr = Object.values(data);
        this.currencies.set(arr);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error.message)
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    })
  }

  convertCurrencies(currencyToConvert: ConvertData): void {
    this.loading.set(true);
    
    this.http.post<number>(CONVERT_CURRENCIES_API, currencyToConvert).subscribe({
      next: (data) => {
        this.result.set(data);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(err.error.message)
        this.loading.set(false);
      },
      complete: () => {
        this.loading.set(false);
      }
    })
  }
}
