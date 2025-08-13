import { Component, effect, inject, OnInit } from '@angular/core';
import { CurrenciesService } from '../../services/currencies/currencies.service';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { combineLatest, debounceTime, startWith } from 'rxjs';
import { ToastrService } from 'ngx-toastr'
import { ConvertData } from '../../models/convert-data.model';
import { ArrowLeftRight, LucideAngularModule } from "lucide-angular";

@Component({
  selector: 'app-converter',
  imports: [ReactiveFormsModule, LucideAngularModule],
  templateUrl: './converter.component.html',
  styleUrl: './converter.component.css'
})
export class ConverterComponent implements OnInit {

  readonly Swap = ArrowLeftRight;
  currenciesService = inject(CurrenciesService);
  fb = inject(FormBuilder);
  toastr = inject(ToastrService);

  currencies = this.currenciesService._currencies;
  currencyFromConvert = this.currenciesService._currencyFromConvert;
  currencyToConvert = this.currenciesService._currencyToConvert;
  result = this.currenciesService._result;
  loading = this.currenciesService._loading;

  formGroup = this.fb.group({
    amount: [1, [Validators.required, Validators.min(0.1)]],
    fromConvert: [this.currencyFromConvert().code, [Validators.required]],
    toConvert: [this.currencyToConvert().code, [Validators.required]]
  })

  constructor() {
    this.initializeData();
    this.setupErrorHandling();
  }

  private initializeData(): void {
    this.currenciesService.getCurrencies();
  }

  private setupErrorHandling(): void {
    effect(() => {
      const error = this.currenciesService._error();
      if (error) {
        this.toastr.error(error);
      }
    });
  }

  ngOnInit(): void {
    const amountChanges = this.formGroup.get('amount')!.valueChanges.pipe(startWith(this.formGroup.get('amount')!.value), debounceTime(500));
    const fromChanges = this.formGroup.get('fromConvert')!.valueChanges.pipe(startWith(this.formGroup.get('fromConvert')!.value), debounceTime(500));
    const toChanges = this.formGroup.get('toConvert')!.valueChanges.pipe(startWith(this.formGroup.get('toConvert')!.value), debounceTime(500));

    combineLatest([amountChanges, fromChanges, toChanges])
      .subscribe(([amount, fromConvert, toConvert]) => {
        const amountValidated = Number(amount);
        if (!isNaN(amountValidated) && amountValidated > 0.1 && fromConvert != null && toConvert != null) {
          this.submit();
        }
      });
  }

  getCurrencyByCode(code: string) {
    return this.currencies().find(c => c.code === code) ?? null;
  }

  swapCurrencies() {
    const { fromConvert, toConvert } = this.formGroup.value;

    this.formGroup.patchValue({
      fromConvert: toConvert,
      toConvert: fromConvert
    });
  }

  submit() {
    const { amount, fromConvert, toConvert } = this.formGroup.value

    if (this.formGroup.invalid) return;
    if (amount == null || fromConvert == null || toConvert == null) return;

    const payload: ConvertData = {
      amount: Number(amount),
      fromConvert: fromConvert.trim(),
      toConvert: toConvert.trim()
    }

    this.currenciesService.convertCurrencies(payload);
  }
}
