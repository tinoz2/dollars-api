import Decimal from 'decimal.js';

export interface ConvertData {
    amount: Decimal | number;
    fromConvert: string;
    toConvert: string;
}