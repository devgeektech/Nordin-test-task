import "server-only";

import { COMPANY_STATUSES, type Company } from "@/lib/api/schema";

const SEED_COMPANIES: ReadonlyArray<{ name: string; domain: string | null }> = [
  { name: "Acme Logistics", domain: "acmelogistics.com" },
  { name: "Blue Harbor Analytics", domain: "blueharbor.io" },
  { name: "Canal Street Coffee", domain: "canalstreetcoffee.nl" },
  { name: "Delta Robotics", domain: "deltarobotics.com" },
  { name: "Evergreen Health", domain: "evergreenhealth.org" },
  { name: "Fjord Energy", domain: "fjordenergy.no" },
  { name: "Gouda Foods", domain: "goudafoods.nl" },
  { name: "Helix Biotech", domain: "helixbio.com" },
  { name: "Iris Payments", domain: "irispay.eu" },
  { name: "Juniper Legal", domain: null },
  { name: "Kite Mobility", domain: "kitemobility.com" },
  { name: "Lumen Labs", domain: "lumenlabs.ai" },
  { name: "Molen Software", domain: "molensoftware.nl" },
  { name: "Northwind Traders", domain: "northwind.com" },
  { name: "Orbit Media", domain: "orbitmedia.co" },
  { name: "Polder Construction", domain: "polderbouw.nl" },
  { name: "Quantum Freight", domain: "quantumfreight.com" },
  { name: "Rivet Manufacturing", domain: null },
  { name: "Solar Tulip", domain: "solartulip.nl" },
  { name: "Tidewater Insurance", domain: "tidewater.com" },
  { name: "Umbra Security", domain: "umbrasec.io" },
  { name: "Vesta Real Estate", domain: "vesta-re.com" },
  { name: "Windmill Ventures", domain: "windmill.vc" },
  { name: "Xenon Displays", domain: "xenondisplays.com" },
  { name: "Yellowstone Outdoor", domain: "yellowstone-outdoor.com" },
  { name: "Zephyr Airlines", domain: "zephyrair.com" },
  { name: "Amstel Advisory", domain: "amsteladvisory.nl" },
  { name: "Brightline Education", domain: "brightline.edu" },
  { name: "Copperleaf Studios", domain: "copperleaf.design" },
  { name: "Dune Hospitality", domain: null },
  { name: "Eindhoven Photonics", domain: "ehvphotonics.nl" },
  { name: "Falcon Data", domain: "falcondata.io" },
  { name: "Granite Capital", domain: "granitecap.com" },
  { name: "Hollandia Dairy", domain: "hollandiadairy.nl" },
  { name: "Ivory Fashion", domain: "ivoryfashion.com" },
  { name: "Jade Telecom", domain: "jadetelecom.com" },
  { name: "Keystone Medical", domain: "keystonemed.com" },
  { name: "Lighthouse Marketing", domain: "lighthouse.agency" },
  { name: "Meridian Shipping", domain: "meridianshipping.com" },
  { name: "Nimbus Cloud", domain: "nimbuscloud.dev" },
];

const SEED_REFERENCE_TIME = Date.parse("2026-10-30T09:00:00.000Z");
const HOUR_MS = 60 * 60 * 1000;

/** Deterministic seed so ids (and therefore shared links) survive restarts. */
export function createSeedCompanies(): Company[] {
  return SEED_COMPANIES.map(({ name, domain }, index) => {
    const createdAt = new Date(
      SEED_REFERENCE_TIME - index * 37 * HOUR_MS,
    ).toISOString();
    return {
      id: `5eed0000-0000-4000-8000-${String(index + 1).padStart(12, "0")}`,
      name,
      domain,
      status: COMPANY_STATUSES[index % COMPANY_STATUSES.length] ?? "new",
      version: 1,
      created_at: createdAt,
      updated_at: createdAt,
    };
  });
}
