import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export interface Props {
  children: React.ReactNode;
}

export const Portal = ({ children }: Props) => {
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    const newPortalRoot = document.createElement("div");
    document.body.appendChild(newPortalRoot);
    setPortalRoot(newPortalRoot);

    return () => {
      newPortalRoot && document.body.removeChild(newPortalRoot);
    };
  }, []);

  return portalRoot && createPortal(children, portalRoot);
};
