'use client';

import { Tabs } from 'govuk-react';
import React, { JSX, useState } from 'react';

interface TabItem {
  id: string;
  title: string;
  content: JSX.Element;
}

export const TabContainer = ({ items }: { items: TabItem[] }) => {
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
        {items.map(({ title, id }, index) => (
          <Tabs.Tab
            onClick={(e) => handleClick(e, index)}
            href="#"
            selected={tabIndex === index}
            key={id}
          >
            {title}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {items.map(({ content, id }, index) => (
        <Tabs.Panel selected={tabIndex === index} key={id}>
          {content}
        </Tabs.Panel>
      ))}
    </Tabs>
  );
};
