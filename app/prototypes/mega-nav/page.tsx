import type { Metadata } from "next"
import EnterpriseAiCollectionPageV2 from "../../collections/enterprise-ai/v2/page"

export const metadata: Metadata = {
  title: "Mega nav prototype · GetSmarter",
}

/**
 * The mega nav needs a page to open over: this is the AI for Executives
 * playbook page, the first playbook in the menu, exactly as it stands.
 */
export default function MegaNavPrototypePage() {
  return <EnterpriseAiCollectionPageV2 />
}
