'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

export function ParallaxComponent({ children, layersData, title = "DEFENCE ROGER" }) {
  const parallaxRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const triggerElement = parallaxRef.current?.querySelector('[data-parallax-layers]');

    if (triggerElement) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: triggerElement,
          start: "0% 0%",
          end: "100% 0%",
          scrub: 0
        }
      });

      const layers = layersData || [
        { layer: "1", yPercent: 12 },
        { layer: "2", yPercent: 10 },
        { layer: "3", yPercent: 8 },
        { layer: "4", yPercent: 5 }
      ];

      layers.forEach((layerObj, idx) => {
        const targets = triggerElement.querySelectorAll(`[data-parallax-layer="${layerObj.layer}"]`);
        if (targets.length > 0) {
          tl.to(
            targets,
            {
              yPercent: layerObj.yPercent,
              ease: "none"
            },
            idx === 0 ? undefined : "<"
          );
        }
      });
    }

    let lenis;
    try {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
      });

      lenis.on('scroll', ScrollTrigger.update);
      
      const tickerCallback = (time) => {
        lenis.raf(time * 1000);
      };
      
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      return () => {
        ScrollTrigger.getAll().forEach(st => st.kill());
        if (triggerElement) gsap.killTweensOf(triggerElement);
        gsap.ticker.remove(tickerCallback);
        lenis.destroy();
      };
    } catch (err) {
      console.warn("Lenis smooth scroll initialization fallback:", err);
    }
  }, [layersData]);

  return (
    <div className="parallax overflow-hidden w-full relative" ref={parallaxRef}>
      <div className="parallax__header relative w-full">
        <div className="parallax__visuals relative w-full overflow-hidden">
          <div data-parallax-layers className="parallax__layers relative w-full">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ParallaxComponent;
