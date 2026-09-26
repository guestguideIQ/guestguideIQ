// Plan tiers from the GuestGuideIQ Business Plan §4 ("Pricing & Monetization
// Strategy"). Shared by the Home pricing teaser and the full /pricing/ page so
// the numbers live in exactly one place.

export interface Plan {
  name: string;
  price: string;
  cadence: string;
  annual: string | null;
  audience: string;
  features: string[];
  featured?: boolean;
}

export const plans: Plan[] = [
  {
    name: 'Solo Host',
    price: '$12',
    cadence: '/ month',
    annual: 'or $120 / year',
    audience: 'For a single property',
    features: [
      '1 active guide',
      'Instant import from your listing URL',
      'Local recommendations that update themselves',
      'Installable guest web app',
    ],
  },
  {
    name: 'Boutique Portfolio',
    price: '$49',
    cadence: '/ month',
    annual: 'or $490 / year',
    audience: 'For hosts with 2–10 properties',
    features: [
      'Up to 10 guides',
      'Your brand colors and fonts',
      'Multi-property dashboard',
      'Basic property-management-system sync',
    ],
    featured: true,
  },
  {
    name: 'Agency / PMC',
    price: '$99+',
    cadence: '/ month',
    annual: null,
    audience: 'For operations with 11+ units',
    features: [
      'Unlimited guides',
      'White-label on your own domain',
      'Deep smart-lock and smart-home sync',
      'Priority support',
    ],
  },
];

// Business Plan §4, "The Revenue Multiplier".
export const UPSELL_FEE = '5%';
