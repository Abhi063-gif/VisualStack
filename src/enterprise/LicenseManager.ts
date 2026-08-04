export type LicenseTier = 'Community' | 'Professional' | 'Enterprise';

export interface LicenseInfo {
  tier: LicenseTier;
  licensee: string;
  key: string;
  expiresAt: string;
  isActivated: boolean;
  maxSeats: number;
}

export class LicenseManager {
  private currentLicense: LicenseInfo = {
    tier: 'Enterprise',
    licensee: 'Enterprise Development Team',
    key: 'VSTACK-ENT-8940-2026-PROD',
    expiresAt: '2028-12-31',
    isActivated: true,
    maxSeats: 50,
  };

  public getLicenseInfo(): LicenseInfo {
    return { ...this.currentLicense };
  }

  public isFeatureAllowed(feature: string): boolean {
    if (this.currentLicense.tier === 'Enterprise') return true;
    if (this.currentLicense.tier === 'Professional') return feature !== 'multi_region_cloud';
    return ['basic_design', 'basic_backend'].includes(feature);
  }
}

export const licenseManager = new LicenseManager();
