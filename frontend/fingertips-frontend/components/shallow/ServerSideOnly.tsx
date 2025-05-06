import { FC, ReactNode, useEffect, useState } from 'react';

interface ServerSideOnlyProps {
  children?: ReactNode;
}

export const ServerSideOnly: FC<ServerSideOnlyProps> = ({ children }) => {
  const [isServerSide, setIsServerSide] = useState(true);

  useEffect(() => {
    setIsServerSide(false);
  }, []);

  return isServerSide ? children : null;
};
