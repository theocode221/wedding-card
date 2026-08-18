import { Link } from "react-router-dom";
import { STUDIO_HANDLE, STUDIO_PORTFOLIO_PATH } from "../../data/studioBrand";

type StudioCreditProps = {
  className?: string;
};

/** Small footer credit linking to the studio portfolio. */
export function StudioCredit({ className = "" }: StudioCreditProps) {
  return (
    <p className={["studio-credit", className].filter(Boolean).join(" ")}>
      <Link to={STUDIO_PORTFOLIO_PATH}>—{STUDIO_HANDLE}</Link>
    </p>
  );
}
