'use client';

import { Tabs } from 'govuk-react';
import React, { JSX, useState } from 'react';

interface TabItem {
  id: string;
  title: string;
  content: JSX.Element;
}

export const TabContainer = ({
  id,
  items,
  footer,
}: {
  id: string;
  items: TabItem[];
  footer?: JSX.Element;
}) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => {
    event.preventDefault();
    setTabIndex(index);
  };

  return (
    <Tabs data-testid={`tabContainer-${id}`}>
      <Tabs.List>
        {items.map(({ title, id }, index) => (
          <Tabs.Tab
            onClick={(e) => handleClick(e, index)}
            href="#"
            selected={tabIndex === index}
            key={id}
            data-testid={`tabTitle-${id}`}
          >
            {title}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {items.map(({ content, id }, index) => (
        <Tabs.Panel
          selected={tabIndex === index}
          key={id}
          data-testid={`tabContent-${id}`}
          style={{
            paddingBottom: '5px',
          }}
        >
          {content}
          <div data-testid={`tabFooter-${id}`}>{footer}</div>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
