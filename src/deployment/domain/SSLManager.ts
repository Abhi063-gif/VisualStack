export interface SSLCertificateInfo {
  id: string;
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'expiring' | 'expired';
  autoRenew: boolean;
}

export class SSLManager {
  private certs: SSLCertificateInfo[] = [];

  public getCertificates(): SSLCertificateInfo[] {
    return [...this.certs];
  }

  public registerCertificate(domain: string): SSLCertificateInfo {
    const item: SSLCertificateInfo = {
      id: `cert_${Date.now().toString(36)}`,
      domain,
      issuer: "Let's Encrypt Authority X3",
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0], // 90 days validity
      status: 'active',
      autoRenew: true,
    };
    this.certs.push(item);
    return item;
  }

  public async renewCertificate(domain: string): Promise<boolean> {
    const cert = this.certs.find((c) => c.domain === domain);
    if (cert) {
      cert.status = 'active';
      cert.validTo = new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0];
      return true;
    }
    return false;
  }
}

export const sslManager = new SSLManager();
