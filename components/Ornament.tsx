import { FiStar } from "react-icons/fi";

export function Ornament({ compact = false }: { compact?: boolean }) {
  return <div className={`ornament ${compact ? "compact" : ""}`} aria-hidden="true"><span /><b><FiStar /></b><span /></div>;
}
