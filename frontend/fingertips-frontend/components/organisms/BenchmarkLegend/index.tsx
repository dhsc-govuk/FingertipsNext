'use client';

import { BenchmarkLabel } from '@/components/organisms/BenchmarkLabel/index';
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



export interface BenchmarkData {
  title?: string;
  group: string;
  types: string[];
}




export const Benchmark = () => {
  const model: BenchmarkData[] = [
    {
      group: 'rag',
      title: 'Areas compared to England',
      types: ['better', 'similar', 'worse', 'not_compared', 'lower', 'higher'],
    },
    {
      title: ' Quintile groupings',
      group: 'quintiles',
      types: ['lowest','low','middle' ,'high', 'highest']
    },
    {
      group: 'quintiles_wv',
      types: ['worst', 'worse', 'middle' , 'better', 'best']
    },
  ];

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
            {item.types.map((type, label_key) => (
              <BenchmarkLabel
                group={item.group}
                type={type}
                key={label_key}
                data-testid={item?.group + '_' + type + '_' + label_key}
              />
            ))}
          </div>
        </BenchmarkLegendGroupPanelStyle>
      ))}
    </div>
  );
};
