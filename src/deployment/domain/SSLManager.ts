export interface SSLCertificateInfo {
  domain: string;
  issuer: string;
  validFrom: string;
  validTo: string;
  status: 'active' | 'expiring' | 'expired';
}

export class SSLManager {
  private certs: SSLCertificateInfo[] = [];

  public getCertificates(): SSLCertificateInfo[] {
    return [...this.certs];
  }

  public registerCertificate(domain: string): SSLCertificateInfo {
    const item: SSLCertificateInfo = {
      domain,
      issuer: "Let's Encrypt Authority X3",
      validFrom: new Date().toISOString().split('T')[0],
      validTo: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
      status: 'active',
    };
    this.certs.push(item);
    return item;
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
