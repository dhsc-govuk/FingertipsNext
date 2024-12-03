'use client';

import { Forecast } from '@/app/page';
import { H1, Paragraph, Table } from 'govuk-react';
import Image from 'next/image';

export function HomePage({
  forecasts,
}: {
  forecasts: Readonly<Array<Forecast>>;
}) {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="p-8">
          <Image
            className="float-right"
            src="/fingertips-logo.svg"
            alt="Fingertips logo"
            width={240}
            height={140}
            priority
          />

          <H1>FingertipsNext</H1>

          <Paragraph>
            Fingertips is a large public health data collection. Data is
            organised into themed profiles.
          </Paragraph>

          <Table
            head={
              <Table.Row>
                <Table.CellHeader date>Date</Table.CellHeader>
                <Table.CellHeader numeric>Temperature C</Table.CellHeader>
                <Table.CellHeader numeric>Temperature F</Table.CellHeader>
                <Table.CellHeader>Summary</Table.CellHeader>
              </Table.Row>
            }
          >
            {forecasts.map((f) => (
              <Table.Row key={f.date}>
                <Table.Cell>{f.date}</Table.Cell>
                <Table.Cell numeric>{f.temperatureC}</Table.Cell>
                <Table.Cell numeric>{f.temperatureF}</Table.Cell>
                <Table.Cell>{f.summary}</Table.Cell>
              </Table.Row>
            ))}
          </Table>
        </div>
      </main>
    </div>
  );
}
