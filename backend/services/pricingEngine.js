const pricingData = require('../data/pricing.json');

function calculateEC2Cost(config, region) {
  const { instanceType, hoursPerDay, pricingType, os } = config;
  const instanceData = pricingData.ec2.instanceTypes[instanceType];

  if (!instanceData) {
    throw new Error(`Unknown instance type: ${instanceType}`);
  }

  let hourlyRate = instanceData.hourlyRate;

  hourlyRate *= pricingData.ec2.osMultiplier[os] || 1;

  if (pricingType === 'spot') {
    hourlyRate *= pricingData.ec2.spotDiscount;
  }

  const regionData = pricingData.regions[region];
  hourlyRate *= regionData ? regionData.multiplier : 1;

  const hoursPerMonth = hoursPerDay * 30;

  return {
    hourly: hourlyRate,
    daily: hourlyRate * hoursPerDay,
    monthly: hourlyRate * hoursPerMonth,
    category: 'compute',
    details: {
      instanceType,
      vcpu: instanceData.vcpu,
      memory: instanceData.memory,
      os,
      pricingType,
      hoursPerDay
    }
  };
}

function calculateS3Cost(config, region) {
  const { storageClass, storageGB, requestsPerMonth } = config;
  const classData = pricingData.s3.storageClasses[storageClass];

  if (!classData) {
    throw new Error(`Unknown storage class: ${storageClass}`);
  }

  const regionData = pricingData.regions[region];
  const multiplier = regionData ? regionData.multiplier : 1;

  const storageCost = storageGB * classData.perGBMonth * multiplier;
  const requestCost = requestsPerMonth * classData.getRequest * multiplier;
  const monthlyCost = storageCost + requestCost;

  return {
    hourly: monthlyCost / 720,
    daily: monthlyCost / 30,
    monthly: monthlyCost,
    category: 'storage',
    details: {
      storageClass,
      storageGB,
      requestsPerMonth,
      storageCost,
      requestCost
    }
  };
}

function calculateRDSCost(config, region) {
  const { engine, instanceType, storageGB, multiAZ } = config;
  const instanceData = pricingData.rds.instanceTypes[instanceType];

  if (!instanceData) {
    throw new Error(`Unknown RDS instance type: ${instanceType}`);
  }

  const regionData = pricingData.regions[region];
  const multiplier = regionData ? regionData.multiplier : 1;

  let hourlyRate = instanceData.hourlyRate * multiplier;

  if (multiAZ) {
    hourlyRate *= pricingData.rds.multiAZMultiplier;
  }

  const computeCost = hourlyRate * 720;
  const storageCost = storageGB * pricingData.rds.storagePerGB * multiplier;
  const monthlyCost = computeCost + storageCost;

  return {
    hourly: monthlyCost / 720,
    daily: monthlyCost / 30,
    monthly: monthlyCost,
    category: 'storage',
    details: {
      engine,
      instanceType,
      vcpu: instanceData.vcpu,
      memory: instanceData.memory,
      storageGB,
      multiAZ,
      computeCost,
      storageCost
    }
  };
}

function calculateDataTransferCost(config, region) {
  const { ingressGB, egressGB } = config;

  const ingressCost = 0;

  let egressCost = 0;
  let remainingGB = egressGB;
  let previousTierLimit = 0;

  for (const tier of pricingData.dataTransfer.egressTiers) {
    if (remainingGB <= 0) break;

    const tierLimit = tier.upToGB === null ? Infinity : tier.upToGB;
    const tierSize = tierLimit - previousTierLimit;
    const gbInTier = Math.min(remainingGB, tierSize);

    egressCost += gbInTier * tier.perGB;
    remainingGB -= gbInTier;
    previousTierLimit = tierLimit;
  }

  const monthlyCost = ingressCost + egressCost;

  return {
    hourly: monthlyCost / 720,
    daily: monthlyCost / 30,
    monthly: monthlyCost,
    category: 'network',
    details: {
      ingressGB,
      egressGB,
      ingressCost,
      egressCost
    }
  };
}

function calculateAllCosts(services, region, productionMode = false) {
  const results = {
    perService: [],
    breakdown: {
      compute: 0,
      storage: 0,
      network: 0,
      hidden: 0
    },
    total: {
      hourly: 0,
      daily: 0,
      monthly: 0
    }
  };

  for (const service of services) {
    let cost;

    switch (service.type) {
      case 'ec2':
        cost = calculateEC2Cost(service, region);
        break;
      case 's3':
        cost = calculateS3Cost(service, region);
        break;
      case 'rds':
        cost = calculateRDSCost(service, region);
        break;
      case 'dataTransfer':
        cost = calculateDataTransferCost(service, region);
        break;
      default:
        continue;
    }

    if (productionMode) {
      const overhead = pricingData.productionOverhead;
      const originalMonthly = cost.monthly;

      cost.monthly *= overhead.redundancyMultiplier;
      cost.monthly += originalMonthly * overhead.backupCostPercentage;
      cost.monthly += originalMonthly * overhead.monitoringCostPercentage;
      cost.monthly += originalMonthly * overhead.loggingCostPercentage;

      cost.hourly = cost.monthly / 720;
      cost.daily = cost.monthly / 30;

      cost.productionOverhead = {
        redundancy: originalMonthly * (overhead.redundancyMultiplier - 1),
        backup: originalMonthly * overhead.backupCostPercentage,
        monitoring: originalMonthly * overhead.monitoringCostPercentage,
        logging: originalMonthly * overhead.loggingCostPercentage
      };
    }

    const quantity = service.quantity || 1;

    results.perService.push({
      id: service.id,
      type: service.type,
      name: service.name || service.type.toUpperCase(),
      quantity: quantity,
      ...cost
    });

    results.breakdown[cost.category] += cost.monthly * quantity;

    results.total.hourly += cost.hourly * quantity;
    results.total.daily += cost.daily * quantity;
    results.total.monthly += cost.monthly * quantity;
  }

  return results;
}

function estimateHiddenCosts(services, region) {
  const hiddenCosts = [];
  let totalHidden = 0;

  const hasEC2 = services.some(s => s.type === 'ec2');
  const hasS3 = services.some(s => s.type === 's3');
  const hasRDS = services.some(s => s.type === 'rds');

  if (hasEC2) {
    const ec2Services = services.filter(s => s.type === 'ec2');
    const totalHoursPerMonth = ec2Services.reduce((sum, s) => sum + (s.hoursPerDay * 30), 0);
    const natGatewayCost = (totalHoursPerMonth * pricingData.dataTransfer.natGatewayHourly) +
      (50 * pricingData.dataTransfer.natGatewayPerGB);

    hiddenCosts.push({
      category: 'NAT Gateway',
      description: 'EC2 instances in private subnets require NAT Gateway for internet access',
      estimatedMonthlyCost: Math.round(natGatewayCost * 100) / 100,
      severity: 'warning'
    });
    totalHidden += natGatewayCost;
  }

  if (hasEC2 && hasS3) {
    const s3Service = services.find(s => s.type === 's3');
    const estimatedCrossRegion = (s3Service.requestsPerMonth || 10000) * 0.001 * pricingData.dataTransfer.crossRegionPerGB;

    hiddenCosts.push({
      category: 'Inter-Service Traffic',
      description: 'Data transfer between EC2 and S3 within the same region',
      estimatedMonthlyCost: Math.round(estimatedCrossRegion * 100) / 100,
      severity: 'info'
    });
    totalHidden += estimatedCrossRegion;
  }

  if (hasRDS && hasEC2) {
    const connectionOverhead = 15;
    hiddenCosts.push({
      category: 'Database Connections',
      description: 'Connection pooling and management overhead for RDS',
      estimatedMonthlyCost: connectionOverhead,
      severity: 'info'
    });
    totalHidden += connectionOverhead;
  }

  const dataTransfer = services.find(s => s.type === 'dataTransfer');
  if (dataTransfer && dataTransfer.egressGB > 100) {
    const unexpectedEgress = dataTransfer.egressGB * 0.2 * 0.09;
    hiddenCosts.push({
      category: 'Egress Spikes',
      description: 'Traffic often exceeds estimates by 20-30%',
      estimatedMonthlyCost: Math.round(unexpectedEgress * 100) / 100,
      severity: 'warning'
    });
    totalHidden += unexpectedEgress;
  }

  if (hasEC2) {
    const snapshotCost = 20;
    hiddenCosts.push({
      category: 'EBS Snapshots',
      description: 'Automated EBS snapshots for EC2 volumes',
      estimatedMonthlyCost: snapshotCost,
      severity: 'info'
    });
    totalHidden += snapshotCost;
  }

  return {
    hiddenCosts,
    totalHiddenCost: Math.round(totalHidden * 100) / 100
  };
}

module.exports = {
  calculateEC2Cost,
  calculateS3Cost,
  calculateRDSCost,
  calculateDataTransferCost,
  calculateAllCosts,
  estimateHiddenCosts
};
