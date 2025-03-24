'use client';

export interface FilterSummaryPanelProps {
  changeSelection?: () => void;
}

export const FilterSummaryPanel = ({
  changeSelection,
}: FilterSummaryPanelProps) => {
  return (
    <div>
      <button onClick={changeSelection}>Change selection</button>
    </div>
  );
};
