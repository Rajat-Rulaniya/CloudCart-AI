export const demoArchitecture = [
  {
    type: 'ec2',
    name: 'Web Server Cluster',
    instanceType: 'm5.large',
    hoursPerDay: 24,
    pricingType: 'on-demand',
    os: 'linux',
    quantity: 2
  },
  {
    type: 'ec2',
    name: 'API Server',
    instanceType: 't3.large',
    hoursPerDay: 24,
    pricingType: 'on-demand',
    os: 'linux',
    quantity: 2
  },
  {
    type: 's3',
    name: 'Media Storage',
    storageClass: 'standard',
    storageGB: 500,
    requestsPerMonth: 100000
  },
  {
    type: 'rds',
    name: 'Production Database',
    engine: 'postgres',
    instanceType: 'db.r5.large',
    storageGB: 100,
    multiAZ: true
  },
  {
    type: 'dataTransfer',
    name: 'Data Transfer',
    ingressGB: 50,
    egressGB: 200
  }
];

export const regions = [
  { value: 'us-east-1', label: 'US East (N. Virginia)', flag: '🇺🇸' },
  { value: 'us-west-2', label: 'US West (Oregon)', flag: '🇺🇸' },
  { value: 'eu-west-1', label: 'EU (Ireland)', flag: '🇮🇪' },
  { value: 'ap-south-1', label: 'Asia Pacific (Mumbai)', flag: '🇮🇳' },
  { value: 'ap-southeast-1', label: 'Asia Pacific (Singapore)', flag: '🇸🇬' }
];

export const ec2InstanceTypes = [
  { value: 't3.micro', label: 't3.micro (2 vCPU, 1 GB)', vcpu: 2, memory: 1 },
  { value: 't3.small', label: 't3.small (2 vCPU, 2 GB)', vcpu: 2, memory: 2 },
  { value: 't3.medium', label: 't3.medium (2 vCPU, 4 GB)', vcpu: 2, memory: 4 },
  { value: 't3.large', label: 't3.large (2 vCPU, 8 GB)', vcpu: 2, memory: 8 },
  { value: 'm5.large', label: 'm5.large (2 vCPU, 8 GB)', vcpu: 2, memory: 8 },
  { value: 'm5.xlarge', label: 'm5.xlarge (4 vCPU, 16 GB)', vcpu: 4, memory: 16 },
  { value: 'r5.large', label: 'r5.large (2 vCPU, 16 GB)', vcpu: 2, memory: 16 }
];

export const s3StorageClasses = [
  { value: 'standard', label: 'S3 Standard', description: 'Frequently accessed data' },
  { value: 'infrequent', label: 'S3 Infrequent Access', description: 'Long-lived, infrequently accessed' },
  { value: 'glacier', label: 'S3 Glacier', description: 'Archive storage' }
];

export const rdsInstanceTypes = [
  { value: 'db.t3.micro', label: 'db.t3.micro (2 vCPU, 1 GB)', vcpu: 2, memory: 1 },
  { value: 'db.t3.small', label: 'db.t3.small (2 vCPU, 2 GB)', vcpu: 2, memory: 2 },
  { value: 'db.t3.medium', label: 'db.t3.medium (2 vCPU, 4 GB)', vcpu: 2, memory: 4 },
  { value: 'db.r5.large', label: 'db.r5.large (2 vCPU, 16 GB)', vcpu: 2, memory: 16 },
  { value: 'db.r5.xlarge', label: 'db.r5.xlarge (4 vCPU, 32 GB)', vcpu: 4, memory: 32 }
];

export const rdsEngines = [
  { value: 'postgres', label: 'PostgreSQL', icon: '🐘' },
  { value: 'mysql', label: 'MySQL', icon: '🐬' }
];

export const tooltips = {
  ec2: 'Amazon EC2 provides scalable computing capacity in the cloud.',
  s3: 'Amazon S3 is object storage built to store and retrieve any amount of data.',
  rds: 'Amazon RDS makes it easy to set up, operate, and scale a relational database.',
  dataTransfer: 'Data transfer costs for moving data in and out of AWS.',
  spot: 'Spot Instances let you use spare EC2 capacity at up to 90% discount.',
  onDemand: 'On-Demand Instances let you pay by the hour with no commitments.',
  multiAZ: 'Multi-AZ provides high availability by replicating your database in another zone.',
  productionMode: 'Production mode adds backups, monitoring, logging, and redundancy overhead.'
};
