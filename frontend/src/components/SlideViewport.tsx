import { useEffect, useRef, useState, type ReactNode } from 'react';
export function SlideViewport({ width, height, minimumDisplayWidth, children }: {
  width: number; height: number; minimumDisplayWidth: number; children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(minimumDisplayWidth);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new ResizeObserver(entries => setAvailable(entries[0].contentRect.width));
    observer.observe(ref.current);return () => observer.disconnect();
  }, []);
  const scale = Math.min(1, Math.max(minimumDisplayWidth,available) / width);
  return <div className="slide-viewport" ref={ref} data-slide-scale={scale}>
    <div className="slide-footprint" style={{width:width*scale,height:height*scale}}>
      <div className="slide-transform" style={{width,height,transform:'scale('+scale+')'}}>{children}</div>
    </div>
  </div>;
}
