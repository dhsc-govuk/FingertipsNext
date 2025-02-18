'use client';

import { Tabs } from 'govuk-react';
import React, { JSX, useState } from 'react';

interface TabItem {
  title: string;
  content: JSX.Element;
}

export const TabContainer = (items: TabItem[]) => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    index: number
  ) => {
    event.preventDefault();
    setTabIndex(index);
  };

  return (
    <Tabs>
      <Tabs.List>
        {items.map(({ title }, index) => (
          <Tabs.Tab
            onClick={(e) => handleClick(e, 1)}
            href="#"
            selected={tabIndex === index}
          >
            {title}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {items.map(({ content }, index) => (
        <Tabs.Panel selected={tabIndex === index}>{content}</Tabs.Panel>
      ))}
    </Tabs>
  );
};
