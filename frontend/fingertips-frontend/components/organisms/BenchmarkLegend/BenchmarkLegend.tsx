'use client';

import { LegendLabel } from './LegendLabel';
import styled from 'styled-components';
import { LabelText } from 'govuk-react';

const BenchmarkLegendGroupPanelStyle = styled('div')({
  'border': '0px solid #000',
  'width': 'flex',
  'clear': 'both',
  'alignItems': 'center',
  'alignContent': 'center',
  'gap': '5px',
  'flexWrap': 'wrap',
  'display': 'flex !important',
  'marginBottom': '10px',
  '& .legend_panel_header': {
    border: '0px',
    margin: '0px 0px 0px 1px',
    alignSelf: 'stretch',
    color: '#000',
    fontFamily: 'GDS Transport',
    fontSize: '16px',
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: '22px',
  },
});

export interface LegendLabelData {
  label: string;
  type: string;
}

export interface BenchmarkData {
  title?: string;
  group: string;
  labels: LegendLabelData[];
}

export interface BenchmarkProps {
  model?: BenchmarkData[] | undefined;
}

export const Benchmark: React.FC<BenchmarkProps> = ({ model }) => {
  return (
    <div>
      {model?.map((item, index) => (
        <BenchmarkLegendGroupPanelStyle key={index}>
          <div>
            {item.title !== null && (
              <div>
                <LabelText className="legend_panel_header">
                  {item.title}
                </LabelText>
              </div>
            )}
            {item?.labels.map((label, label_key) => (
              <LegendLabel
                group={item?.group}
                label={label?.label}
                type={label.type}
                key={label_key}
                data-testid={item?.group + '_' + label.type + '_' + label_key}
              />
            ))}
          </div>
        </BenchmarkLegendGroupPanelStyle>
      ))}
    </div>
  );
};
