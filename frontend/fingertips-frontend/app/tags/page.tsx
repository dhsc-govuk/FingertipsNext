import React from 'react';
import { TrendTag } from '@/components/molecules/TrendTag';
import { Trend, TrendCondition } from '@/lib/common-types';

/**
 * Dummy page used to test tags
 */

const page = () => {
  return (
    <div>
      <TrendTag
        trend={Trend.INCREASING}
        trendCondition={TrendCondition.GETTING_WORSE}
      />
      <TrendTag
        trend={Trend.DECREASING}
        trendCondition={TrendCondition.GETTING_BETTER}
      />
      <TrendTag trend={Trend.NO_SIGNIFICANT_CHANGE} />
      <TrendTag trend={Trend.DECREASING} />
      <TrendTag trend={Trend.INCREASING} />
    </div>
  );
};

export default page;
