import { viewSelector } from '@/lib/viewUtils/viewSelector';
import { H3 } from 'govuk-react';

interface;

export function ViewsSkeleton() {
  const views = viewSelector();
  return (
    <div>
      <H3>What chart views should we see?</H3>
      <ul>
        {Object.keys(views).map((view) => {
          console.log(view, views[view].toString());
          return (
            <li key={view}>
              {view}: {views[view].toString()}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
