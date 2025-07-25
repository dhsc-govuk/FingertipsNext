import { DatePeriod, Frequency } from '@/generated-sources/ft-api-client';

export interface DatePeriodWithFrequency extends DatePeriod {
  frequency: Frequency;
}
