export interface CustomDomainConfig {
  id: string;
  domain: string;
  verified: boolean;
  sslActive: boolean;
  dnsRecords: Array<{ type: string; name: string; value: string }>;
}

export class DomainManager {
  private domains: CustomDomainConfig[] = [
    {
      id: 'dom_01',
      domain: 'app.visualstack.io',
      verified: true,
      sslActive: true,
      dnsRecords: [
        { type: 'CNAME', name: 'app', value: 'cname.vercel-dns.com' },
        { type: 'A', name: '@', value: '76.76.21.21' },
      ],
    },
  ];

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
        { type: 'CNAME', name: domain.split('.')[0], value: 'cname.vercel-dns.com' },
      ],
    };
    this.domains.push(item);
    return item;
  }
}

export const domainManager = new DomainManager();
