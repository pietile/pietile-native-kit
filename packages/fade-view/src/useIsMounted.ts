import { useCallback, useEffect, useRef } from 'react';

export function useIsMounted(): () => boolean {
  const refMounted = useRef(false);

  useEffect(() => {
    refMounted.current = true;

    return () => {
      refMounted.current = false;
    };
  });

  const isMounted = useCallback(() => {
    return refMounted.current;
  }, []);

  return isMounted;
}
