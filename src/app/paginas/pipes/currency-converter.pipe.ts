// src/app/pipes/currency-converter.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyConvert',
  standalone: true
})
export class CurrencyConverterPipe implements PipeTransform {
  /**
   * Transforma un valor de moneda.
   * @param value El monto a convertir (siempre en la moneda base).
   * @param baseCurrency La moneda de origen del valor (ej: 'USD').
   * @param targetCurrency La moneda a la que se debe convertir (ej: 'NIO' o 'USD').
   * @param exchangeRate La tasa de cambio (ej: 36.6243 para 1 USD = 36.6243 NIO).
   * @param maximumFractionDigits El formato de decimales de Angular ('1.2-2' por defecto).
   * @returns El valor convertido y formateado como string.
   */
  transform(
    value: number | undefined | null,
    baseCurrency: 'USD',
    targetCurrency: 'USD' | 'NIO',
    exchangeRate: number,
    maximumFractionDigits: number = 2
  ): string {
    if (value === null || value === undefined) {
      return '';
    }

    let finalValue = value;
    let symbol: string = '$';

    if (targetCurrency === 'NIO' && baseCurrency === 'USD') {
      finalValue = value * exchangeRate;
      symbol = 'C$';
    }

    return symbol + ' ' + finalValue.toLocaleString('en-US', {
      minimumFractionDigits: maximumFractionDigits,
      maximumFractionDigits: maximumFractionDigits
    });
  }
}