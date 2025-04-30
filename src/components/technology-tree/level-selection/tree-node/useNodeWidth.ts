
import { useState, useEffect, RefObject } from 'react';

export const useNodeWidth = (nodeRef: RefObject<HTMLDivElement>) => {
  const [nodeWidth, setNodeWidth] = useState(0);

  useEffect(() => {
    // Update width on mount and window resize
    const updateWidth = () => {
      if (nodeRef.current) {
        setNodeWidth(nodeRef.current.offsetWidth);
      }
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    
    return () => window.removeEventListener('resize', updateWidth);
  }, [nodeRef]);

  return nodeWidth;
};
