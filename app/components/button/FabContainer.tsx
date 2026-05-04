import type { FC, PropsWithChildren } from 'react';

export const FabContainer: FC<PropsWithChildren> = (props) => (
  <div
    {...props}
    className="fixed right-1/2 bottom-10 flex translate-x-[calc(min(47.5vw,20.5rem))] gap-4 *:shadow-lg lg:bottom-6"
  />
);
