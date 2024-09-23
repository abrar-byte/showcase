import React, { Dispatch } from 'react';
import { DateRangePicker } from 'react-date-range';
import { enUS, fr, es, id } from 'date-fns/locale';

export type Range = {
  startDate: Date;
  endDate: Date;
  key: any;
};

type Props = {
  rangeProps: [Range, Dispatch<React.SetStateAction<Range>>];
  months?: number;
  direction?: 'horizontal' | 'vertical';
};

export const initialRange = {
  startDate: new Date(),
  endDate: new Date(),
  key: 'selection',
};

const localeMap = {
  en: enUS,
  fr: fr,
  es: es,
  id: id,
} as const;

const userLocale = Intl.DateTimeFormat().resolvedOptions().locale.split('-')[0];
const dateFnsLocale = localeMap[userLocale as keyof typeof localeMap] || enUS;

export default function DateRange({
  rangeProps,
  months = 1,
  direction,
}: Props) {
  const [range, setRange] = rangeProps;

  return (
    <DateRangePicker
      locale={dateFnsLocale}
      onChange={(item: any) => setRange(item.selection)}
      staticRanges={[]}
      inputRanges={[]}
      moveRangeOnFirstSelection={false}
      retainEndDateOnFirstSelection={true}
      months={months}
      minDate={new Date()}
      ranges={[range]}
      rangeColors={['#3563E9']}
      direction={direction}
      showMonthAndYearPickers={false} // Show month and year pickers
      showDateDisplay={false} // Hide date display
    />
  );
}
