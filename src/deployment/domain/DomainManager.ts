export interface CustomDomainConfig {
  id: string;
  domain: string;
  verified: boolean;
  sslActive: boolean;
  dnsRecords: Array<{ type: string; name: string; value: string }>;
}

export class DomainManager {
  private domains: CustomDomainConfig[] = [];

  public getDomains(): CustomDomainConfig[] {
    return [...this.domains];
  }

  public addDomain(domain: string): CustomDomainConfig {
    const item: CustomDomainConfig = {
      id: `dom_${Date.now()}`,
      domain,
      verified: false,
      sslActive: false,
      dnsRecords: [
        { type: 'CNAME', name: domain.split('.')[0], value: 'cname.visualstack-dns.com' },
      ],
    };
    this.domains.push(item);
    return item;
  }

  public removeDomain(id: string): void {
    this.domains = this.domains.filter((d) => d.id !== id);
  }
}

export const domainManager = new DomainManager();
