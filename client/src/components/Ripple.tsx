import React, { useState, useEffect, useRef } from "react";
import styled from "@emotion/styled";

export const Ripple = () => {
  const animationDuration = 600; // ms
  const [ripples, setRipples] = useState<
    Array<{ x: number; y: number; size: number }>
  >([]);
  const containerRef = useRef<HTMLDivElement>(null);

  const createRipple = (event: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      const size = Math.max(rect.width, rect.height);
      setRipples((prevRipples) => [...prevRipples, { x, y, size }]);
    }
  };

  useEffect(() => {
    if (ripples.length > 0) {
      const timer = setTimeout(() => {
        setRipples((prevRipples) => prevRipples.slice(1));
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [ripples]);

  return (
    <RippleContainer onMouseDown={createRipple} ref={containerRef}>
      {ripples.map((ripple, index) => (
        <RippleSVG
          key={index}
          x={ripple.x}
          y={ripple.y}
          size={ripple.size}
          animationDuration={animationDuration}
        >
          <circle cx="50%" cy="50%" r="50%" />
        </RippleSVG>
      ))}
    </RippleContainer>
  );
};

const RippleContainer = styled.div`
  overflow: hidden;
  position: absolute;
  inset: 0;
  border-radius: inherit;
  color: inherit;
`;

const RippleSVG = styled.svg<{
  x: number;
  y: number;
  size: number;
  animationDuration: number;
}>`
  position: absolute;
  fill: currentColor;
  pointer-events: none;

  left: ${({ x, size }) => `${x - size / 2}px`};
  top: ${({ y, size }) => `${y - size / 2}px`};

  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};

  animation: ripple ${({ animationDuration }) => animationDuration}ms linear
    forwards;

  @keyframes ripple {
    from {
      transform: scale(0);
      opacity: 0.3;
    }
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`;
