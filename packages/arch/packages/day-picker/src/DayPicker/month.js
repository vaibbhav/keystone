// @flow
/** @jsx jsx */
import { jsx } from '@emotion/core';
import { isSameMonth, isEqual as areDatesEqual, format, setMonth } from 'date-fns';
import { memo, useRef, useEffect } from 'react';
import { colors } from '@arch-ui/theme';
import { months, type Weeks } from './utils';
import { WeekRow, Day } from './comps';

type Props = {
  style: Object,
  index: number,
  data: {
    observer: IntersectionObserver,
    onSelectedChange: Date => void,
    selectedDate: Date | null,
    items: Array<{
      weeks: Weeks,
      month: number,
      year: number,
    }>,
  },
};

export const Month = memo<Props>(({ style, index, data }) => {
  const { items, selectedDate, onSelectedChange, observer } = data;
  const ref = useRef(null);

  useEffect(
    () => {
      const node = ref.current;
      if (node !== null) {
        observer.observe(node);
        return () => observer.unobserve(node);
      }
    },
    [observer]
  );
  const { weeks, month, year } = items[index];
  return (
    <div ref={ref} data-index={index} id={`ks-month-${month}-${year}`} style={style} role="grid">
      <MonthHeader month={month} year={year} />
      {weeks.map((week, i) => (
        <WeekRow key={i}>
          {week.map(day => {
            const date = new Date(year, month, 3);
            const disabled = !isSameMonth(date, day);
            const isSelected =
              !disabled && selectedDate !== null && areDatesEqual(selectedDate, day);
            const label = day.getDate();
            return (
              <Day
                id={`ks-day-${label}-${day.getMonth()}-${day.getFullYear()}${
                  disabled ? '-not-in-month' : ''
                }`}
                key={label}
                onClick={disabled ? null : () => onSelectedChange(day)}
                date={day}
                isDisabled={disabled}
                isSelected={isSelected}
              />
            );
          })}
        </WeekRow>
      ))}
    </div>
  );
});

let readableMonths = months.map(month => format(setMonth(new Date(), month), 'MMMM'));

const MonthHeader = memo(({ month, year }) => {
  return (
    <div
      css={{
        position: 'sticky',
        top: 0,
        width: '100%',
        backgroundColor: '#fff',
      }}
    >
      {/*if you're going to change the styles here make sure
     to update the size in the itemSize prop for List in DayPicker */}
      <div
        css={{
          paddingTop: 4,
          paddingBottom: 4,
          border: `1px ${colors.N60} solid`,
          borderLeft: 0,
          borderRight: 0,
          display: 'flex',
          justifyContent: 'space-between',
          paddingRight: 12,
        }}
      >
        <span
          css={{
            color: colors.N60,
          }}
        >
          {readableMonths[month]}
        </span>
        <span
          css={{
            color: colors.N60,
          }}
        >
          {year}
        </span>
      </div>
    </div>
  );
});
