import { useEffect, useState, type FC } from 'react';

interface Props {
  targetSel?: string;
}

// DISCLAIMER: this hook is untested
const useYScrollProgress = (targetSel: string) => {
  const [scalePerc, setScalePerc] = useState(0);

  useEffect(() => {
    const $el = document.querySelector(targetSel) as HTMLElement | null;
    if (!$el) return;

    const updateScrollPerc = (ev: Event) => {
      const minPixel = $el.offsetTop;
      const maxPixel = minPixel + $el.scrollHeight;
      const value = document.body.scrollTop;

      // respect bounds of element
      let percent = (value - minPixel) / (maxPixel - minPixel);
      percent = Math.min(1, Math.max(percent, 0)) * 100;

      setScalePerc(percent);
    };

    window.addEventListener('scroll', updateScrollPerc);

    () => window.removeEventListener('scroll', updateScrollPerc);
  }, []);

  return scalePerc;
};

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
      className="fixed left-0 top-0 h-2 w-full origin-left bg-blue-300"
      style={{ transform: `scaleX(${scalePerc}%)` }}
    />
  );
};
