import { AreaDocument } from '@/lib/search/searchTypes';
import { Table } from 'govuk-react';
import React from 'react';

interface AreaListProps {
  areas: AreaDocument[];
}

const handleSelectionEvent = (area: AreaDocument) => {
  console.log(`${JSON.stringify(area)}`);
};

export default function AreaSuggestionList({ areas }: Readonly<AreaListProps>) {
  return (
    <div>
      <Table>
        {areas.map((area) => (
          <Table.Row
            key={`${area.areaCode}`}
            onClick={() => handleSelectionEvent(area)}
          >
            <Table.Cell>{area.areaName}</Table.Cell>
            <Table.Cell>{area.areaType}</Table.Cell>
          </Table.Row>
        ))}
      </Table>
    </div>
  );
}
