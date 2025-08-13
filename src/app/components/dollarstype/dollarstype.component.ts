import { Component, computed, effect, inject, signal } from '@angular/core';
import { DollarsService } from '../../services/dollarstypes/dollars.service';
import { CommonModule } from '@angular/common';
import { DollarBase, DollarType, DollarYesterday, EXCLUDED_DOLLAR_TYPES } from '../../models/dollars.model';

@Component({
  selector: 'app-dollarstype',
  imports: [CommonModule],
  templateUrl: './dollarstype.component.html',
  styleUrl: './dollarstype.component.css'
})
export class DollarstypeComponent {

  private dollarsTypeService = inject(DollarsService);

  dollarsType = this.dollarsTypeService._dollarsTypes;
  dollarsYesterday = this.dollarsTypeService._dollarsYesterday;

  porcentajeCambioCompra = computed(() => this.calculatePercentages('compra'));
  porcentajeCambioVenta = computed(() => this.calculatePercentages('venta'));
  dollarsFiltered = computed(() => this.filterDollars(this.dollarsType()));
  dollarsYesterdayFiltered = computed(() => this.filterDollars(this.dollarsYesterday()));

  private initializeData(): void {
    this.dollarsTypeService.getDollars();
    this.dollarsTypeService.getYesterdayDollars();
  }

  constructor() {
    this.initializeData();
  }

  private calculatePercentages(tipo: 'compra' | 'venta'): string[] {
    const hoy = this.dollarsFiltered();
    const ayer = this.dollarsYesterdayFiltered();

    return hoy.map(dolarHoy => {
      const dolarAyer = ayer.find(d => d.casa === dolarHoy.casa);
      if (dolarAyer) return this.calculatePercent(dolarHoy[tipo], dolarAyer[tipo])

      return 'N/A';
    });
  }

  calculatePercent(firstDolar: number, secondDolar: number) {
    const percent = ((firstDolar - secondDolar) / secondDolar) * 100
    const percentFormatted = percent.toFixed(1) + '%'
    if (percentFormatted.startsWith('-')) return percentFormatted + ' menos'
    if (!percentFormatted.startsWith('0.0')) return percentFormatted + ' más'
    return percentFormatted
  }

  filterDollars(rates: DollarBase[]): DollarBase[] {
    return rates.filter(rate => !EXCLUDED_DOLLAR_TYPES.includes(rate.casa));
  }
}
