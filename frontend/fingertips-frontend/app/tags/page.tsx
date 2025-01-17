import React from 'react';
import { TrendTag } from '@/components/molecules/TrendTag';
import { Trend } from '@/lib/common-types';

const page = () => {
  return (
    <div>
      <TrendTag
        displayedText="Increasing and getting worse"
        color="GREEN"
        trend={Trend.INCREASING}
      />
    </div>
  );
};

export default page;
