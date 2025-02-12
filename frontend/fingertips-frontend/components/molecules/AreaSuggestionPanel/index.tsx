/*
 A component that hold the area suggestion list
*/

import { Table } from 'govuk-react';
import { AreaDocument, AREA_TYPE_GP } from '@/lib/search/searchTypes';

function formatAreaName(area: AreaDocument): string {
  return area.areaType === AREA_TYPE_GP
    ? `${area.areaCode} - ${area.areaName}`
    : area.areaName;
}

interface AreaSuggestionPanelProps {
  areas: AreaDocument[];
  onItemSelected: (area: AreaDocument) => void;
}

export const AreaSuggestionPanel = ({
  areas,
  onItemSelected,
}: AreaSuggestionPanelProps) => {
  return (
    <Table>
      {areas.map((area) => (
        <Table.Row
          key={`${area.areaCode}`}
          onClick={() => {
            onItemSelected(area);
          }}
        >
          <Table.Cell>{formatAreaName(area)}</Table.Cell>
          <Table.Cell>{area.areaType}</Table.Cell>
        </Table.Row>
      ))}
    </Table>
  );
};
