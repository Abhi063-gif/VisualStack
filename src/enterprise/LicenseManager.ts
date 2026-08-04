export type LicenseTier = 'Community' | 'Professional' | 'Enterprise';

export interface LicenseInfo {
  tier: LicenseTier;
  licensee: string;
  key: string;
  expiresAt: string;
  isActivated: boolean;
  maxSeats: number;
  monthlyPriceUSD: number;
}

export class LicenseManager {
  private currentLicense: LicenseInfo;

  constructor() {
    this.currentLicense = this.loadState();
  }

  private loadState(): LicenseInfo {
    try {
      const saved = localStorage.getItem('visualstack_license_info_v2');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // Fallback
    }

    return {
      tier: 'Community',
      licensee: 'Individual Developer (Free Tier)',
      key: 'VSTACK-COMMUNITY-FREE',
      expiresAt: 'Lifetime Free',
      isActivated: true,
      maxSeats: 1,
      monthlyPriceUSD: 0,
    };
  }

  private saveState(): void {
    try {
      localStorage.setItem('visualstack_license_info_v2', JSON.stringify(this.currentLicense));
    } catch {
      // Ignore
    }
  }

  public getLicenseInfo(): LicenseInfo {
    return { ...this.currentLicense };
  }

  public purchaseLicense(tier: LicenseTier, name: string): LicenseInfo {
    let seats = 1;
    let price = 0;
    if (tier === 'Professional') {
      seats = 5;
      price = 29;
    } else if (tier === 'Enterprise') {
      seats = 50;
      price = 99;
    }

    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const newKey = `VSTACK-${tier.substring(0, 3).toUpperCase()}-${randomSuffix}-2026`;

    this.currentLicense = {
      tier,
      licensee: name || `${tier} Developer`,
      key: newKey,
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      isActivated: true,
      maxSeats: seats,
      monthlyPriceUSD: price,
    };

    this.saveState();
    return { ...this.currentLicense };
  }

  public activateLicenseKey(key: string): boolean {
    const cleanKey = key.trim().toUpperCase();
    if (!cleanKey.startsWith('VSTACK-')) return false;

    let tier: LicenseTier = 'Professional';
    let seats = 5;
    let price = 29;

    if (cleanKey.includes('ENT')) {
      tier = 'Enterprise';
      seats = 50;
      price = 99;
    } else if (cleanKey.includes('COMM')) {
      tier = 'Community';
      seats = 1;
      price = 0;
    }

    this.currentLicense = {
      tier,
      licensee: `${tier} Activated Account`,
      key: cleanKey,
      expiresAt: '2028-12-31',
      isActivated: true,
      maxSeats: seats,
      monthlyPriceUSD: price,
    };

    this.saveState();
    return true;
  }

  public isFeatureAllowed(feature: string): boolean {
    if (this.currentLicense.tier === 'Enterprise') return true;
    if (this.currentLicense.tier === 'Professional') return feature !== 'multi_region_cloud' && feature !== 'custom_sso';
    return ['basic_design', 'basic_backend'].includes(feature);
  }
}

export const licenseManager = new LicenseManager();
