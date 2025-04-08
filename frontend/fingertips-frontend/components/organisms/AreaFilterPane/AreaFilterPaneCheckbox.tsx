import { Checkbox } from 'govuk-react';
import { FC } from 'react';

interface AreaFilterPaneCheckboxProps {
  code: string;
  name: string;
  handleAreaSelected: (areaCode: string, checked: boolean) => void;
  isSelected: boolean;
}

export const AreaFilterPaneCheckbox: FC<AreaFilterPaneCheckboxProps> = ({
  code,
  name,
  handleAreaSelected,
  isSelected,
}) => {
  return (
    <Checkbox
      value={code}
      sizeVariant="SMALL"
      name="area"
      defaultChecked={isSelected}
      onChange={(e) => {
        handleAreaSelected(code, e.target.checked);
      }}
    >
      {name}
    </Checkbox>
  );
};
