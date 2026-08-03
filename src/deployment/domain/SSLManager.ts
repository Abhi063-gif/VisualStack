export interface SSLCertificateInfo {
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'expiring' | 'expired';
}

export class SSLManager {
  private certs: SSLCertificateInfo[] = [
    {
      domain: 'app.visualstack.io',
      issuer: "Let's Encrypt Authority X3",
      validFrom: '2026-01-01',
      validTo: '2026-12-31',
      status: 'active',
    },
  ];

  public getCertificates(): SSLCertificateInfo[] {
    return [...this.certs];
  }

  public async renewCertificate(domain: string): Promise<boolean> {
    const cert = this.certs.find((c) => c.domain === domain);
    if (cert) {
      cert.status = 'active';
      cert.validTo = new Date(Date.now() + 31536000000).toISOString().split('T')[0];
      return true;
    }
    return false;
  }
}

export const sslManager = new SSLManager();
