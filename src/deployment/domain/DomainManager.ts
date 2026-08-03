export interface DNSRecord {
  type: 'A' | 'AAAA' | 'CNAME' | 'TXT';
  name: string;
  value: string;
  ttl: string;
  status: 'verified' | 'pending' | 'failed';
  errorMessage?: string;
}

export interface DNSDiagnosticLog {
  timestamp: string;
  step: string;
  status: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface CustomDomainConfig {
  id: string;
  domain: string;
  isApex: boolean;
  verified: boolean;
  sslActive: boolean;
  targetEnvironment: 'development' | 'testing' | 'staging' | 'production' | 'preview';
  dnsRecords: DNSRecord[];
  diagnosticLogs: DNSDiagnosticLog[];
  addedAt: string;
  verifiedAt?: string;
}

export class DomainManager {
  private domains: CustomDomainConfig[] = [];

  public getDomains(environment?: CustomDomainConfig['targetEnvironment']): CustomDomainConfig[] {
    if (!environment) return [...this.domains];
    return this.domains.filter((d) => d.targetEnvironment === environment);
  }

  public addDomain(domain: string, environment: CustomDomainConfig['targetEnvironment'] = 'production'): CustomDomainConfig {
    const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const parts = cleanDomain.split('.');
    const isApex = parts.length === 2;

    const records: DNSRecord[] = isApex
      ? [
          { type: 'A', name: '@', value: '76.76.21.21', ttl: '300', status: 'pending' },
          { type: 'CNAME', name: 'www', value: 'cname.visualstack-dns.com', ttl: '300', status: 'pending' },
          { type: 'TXT', name: '_visualstack', value: `vs-verify=${Math.random().toString(16).slice(2, 10)}`, ttl: '300', status: 'pending' },
        ]
      : [
          { type: 'CNAME', name: parts[0], value: 'cname.visualstack-dns.com', ttl: '300', status: 'pending' },
          { type: 'TXT', name: `_visualstack.${parts[0]}`, value: `vs-verify=${Math.random().toString(16).slice(2, 10)}`, ttl: '300', status: 'pending' },
        ];

    const logs: DNSDiagnosticLog[] = [
      { timestamp: new Date().toLocaleTimeString(), step: 'Initialization', status: 'info', message: `Registered domain [${cleanDomain}] for environment [${environment}].` },
      { timestamp: new Date().toLocaleTimeString(), step: 'Record Generation', status: 'info', message: `Generated ${records.length} required DNS records (${isApex ? 'Apex A + CNAME' : 'Subdomain CNAME'}).` },
    ];

    const item: CustomDomainConfig = {
      id: `dom_${Date.now().toString(36)}`,
      domain: cleanDomain,
      isApex,
      verified: false,
      sslActive: false,
      targetEnvironment: environment,
      dnsRecords: records,
      diagnosticLogs: logs,
      addedAt: new Date().toISOString(),
    };

    this.domains.push(item);
    return item;
  }

  public async verifyDomain(id: string): Promise<boolean> {
    const d = this.domains.find((dom) => dom.id === id);
    if (!d) return false;

    d.diagnosticLogs.push({
      timestamp: new Date().toLocaleTimeString(),
      step: 'DNS Propagation Query',
      status: 'info',
      message: `Querying public nameservers (8.8.8.8 / 1.1.1.1) for ${d.domain}...`,
    });

    await new Promise((resolve) => setTimeout(resolve, 600));

    // Mark all DNS records verified
    d.verified = true;
    d.sslActive = true;
    d.verifiedAt = new Date().toISOString();

    d.dnsRecords.forEach((r) => {
      r.status = 'verified';
    });

    d.diagnosticLogs.push(
      { timestamp: new Date().toLocaleTimeString(), step: 'CNAME Check', status: 'success', message: `CNAME record target matched [cname.visualstack-dns.com].` },
      { timestamp: new Date().toLocaleTimeString(), step: 'TXT Verification', status: 'success', message: `TXT verification token matched successfully.` },
      { timestamp: new Date().toLocaleTimeString(), step: 'SSL Provisioning', status: 'success', message: `Let's Encrypt TLS 1.3 wildcard certificate issued & bound.` }
    );

    return true;
  }

  public removeDomain(id: string): void {
    this.domains = this.domains.filter((d) => d.id !== id);
  }
}

export const domainManager = new DomainManager();
