'use client';

import { Table } from 'govuk-react';
import React from 'react';
import { formatNumber } from '@/lib/numberFormatter';

interface CheckValueInTableCellProps {
  value: string | number | undefined;
  style?: React.CSSProperties;
}

export function CheckValueInTableCell({
  value,
  style,
}: Readonly<CheckValueInTableCellProps>) {
  return (
    <Table.Cell
      style={style}
      aria-label={!value && value !== 0 ? 'Not compared' : undefined}
    >
      {!value && value !== 0 ? 'X' : value}
    </Table.Cell>
  );
}

interface FormatNumberInTableCellProps {
  value: number | undefined;
  style?: React.CSSProperties;
}

export function FormatNumberInTableCell({
  value,
  style,
}: Readonly<FormatNumberInTableCellProps>) {
  return (
    <Table.Cell
      style={style}
      aria-label={!value && value !== 0 ? 'Not compared' : undefined}
    >
      {formatNumber(value)}
    </Table.Cell>
  );
}
