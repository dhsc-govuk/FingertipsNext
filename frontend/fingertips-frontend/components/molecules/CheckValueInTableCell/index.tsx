'use client';

import { Table } from 'govuk-react';

interface CheckValueInTableCellProps {
  value: string | number | undefined;
}

export function CheckValueInTableCell({
  value = undefined,
}: Readonly<CheckValueInTableCellProps>) {
  return (
    <Table.Cell aria-label={!value && value !== 0 ? 'Not compared' : undefined}>
      {!value && value !== 0 ? 'X' : value}
    </Table.Cell>
  );
}
