import { useEffect, useState, type FC } from 'react';

interface Props {
  targetSel?: string;
}

const useXScrollProgress = (targetSel: string) => {
  const [scalePerc, setScalePerc] = useState(0);

  useEffect(() => {
    const $el = document.querySelector(targetSel) as HTMLElement | null;
    if (!$el) return;

    const updateScrollPerc = () => {
      const minPixel = $el.offsetLeft;
      const maxPixel = $el.scrollWidth - $el.offsetWidth;
      const value = $el.scrollLeft;

      // respect bounds of element
      let percent = (value - minPixel) / (maxPixel - minPixel);
      percent = Math.min(1, Math.max(percent, 0)) * 100;

      setScalePerc(percent);
    };

    $el.addEventListener('scroll', updateScrollPerc);

    () => window.removeEventListener('scroll', updateScrollPerc);
  }, []);

  return scalePerc;
};

export const ScrollIndicator: FC<Props> = ({ targetSel = 'html' }) => {
  const scalePerc = useXScrollProgress(targetSel);

  return (
    <div
      className="fixed top-0 left-0 z-20 h-2 w-full origin-left bg-blue-300"
      style={{ transform: `scaleX(${scalePerc}%)` }}
    />
  );
};
