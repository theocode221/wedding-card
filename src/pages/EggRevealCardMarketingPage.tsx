import { EggRevealCardPage } from "./EggRevealCardPage";

/**
 * Marketing-safe variant:
 * - generic/non-personal copy
 * - face blur mask on animated reveal image
 */
export function EggRevealCardMarketingPage() {
  return <EggRevealCardPage marketingMode />;
}
