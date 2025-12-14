import { useState } from 'react';
import { useCart } from '../context/CartContext';
import Tooltip from './Tooltip';
import { ec2InstanceTypes, s3StorageClasses, rdsInstanceTypes, rdsEngines } from '../data/staticData';

const serviceIcons = {
  ec2: { type: 'image', src: '/icons/ec2.jpeg', alt: 'EC2' },
  s3: { type: 'image', src: '/icons/s3.jpeg', alt: 'S3' },
  rds: { type: 'image', src: '/icons/rds.png', alt: 'RDS' },
  dataTransfer: { type: 'emoji', icon: '🌐' }
};

const serviceDescriptions = {
  ec2: 'Elastic Compute Cloud',
  s3: 'Simple Storage Service',
  rds: 'Relational Database Service',
  dataTransfer: 'Data Transfer'
};

function QuantityInput({ value, onChange, min = 1, max = 100 }) {
  const handleDecrement = () => {
    if (value > min) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <div className="quantity-input">
      <button type="button" onClick={handleDecrement}>−</button>
      <input
        type="number"
        value={value}
        onChange={(e) => {
          const v = parseInt(e.target.value) || min;
          onChange(Math.min(max, Math.max(min, v)));
        }}
        min={min}
        max={max}
      />
      <button type="button" onClick={handleIncrement}>+</button>
    </div>
  );
}

function EC2Form({ onAdd }) {
  const [config, setConfig] = useState({
    name: 'Web Server',
    instanceType: 't3.large',
    hoursPerDay: 24,
    pricingType: 'on-demand',
    os: 'linux',
    quantity: 1
  });

  const handleSubmit = () => {
    onAdd({ type: 'ec2', ...config });
  };

  return (
    <div className="service-card-body">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Instance Name</label>
          <input
            type="text"
            className="form-control"
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Quantity</label>
          <QuantityInput
            value={config.quantity}
            onChange={(quantity) => setConfig({ ...config, quantity })}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Instance Type <Tooltip term="ec2" />
        </label>
        <select
          className="form-control"
          value={config.instanceType}
          onChange={(e) => setConfig({ ...config, instanceType: e.target.value })}
        >
          {ec2InstanceTypes.map(type => (
            <option key={type.value} value={type.value}>{type.label}</option>
          ))}
        </select>
      </div>

      <div className="form-row-3">
        <div className="form-group">
          <label className="form-label">Hours/Day</label>
          <input
            type="number"
            className="form-control"
            min="1"
            max="24"
            value={config.hoursPerDay}
            onChange={(e) => setConfig({ ...config, hoursPerDay: parseInt(e.target.value) || 24 })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">OS</label>
          <select
            className="form-control"
            value={config.os}
            onChange={(e) => setConfig({ ...config, os: e.target.value })}
          >
            <option value="linux">Linux</option>
            <option value="windows">Windows</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Pricing <Tooltip term="spot" />
          </label>
          <select
            className="form-control"
            value={config.pricingType}
            onChange={(e) => setConfig({ ...config, pricingType: e.target.value })}
          >
            <option value="on-demand">On-Demand</option>
            <option value="spot">Spot</option>
          </select>
        </div>
      </div>

      <button className="btn btn-primary btn-block" onClick={handleSubmit}>
        ➕ Add to Cart
      </button>
    </div>
  );
}

function S3Form({ onAdd }) {
  const [config, setConfig] = useState({
    name: 'App Storage',
    storageClass: 'standard',
    storageGB: 100,
    requestsPerMonth: 10000,
    quantity: 1
  });

  const handleSubmit = () => {
    onAdd({ type: 's3', ...config });
  };

  return (
    <div className="service-card-body">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Bucket Name</label>
          <input
            type="text"
            className="form-control"
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Buckets</label>
          <QuantityInput
            value={config.quantity}
            onChange={(quantity) => setConfig({ ...config, quantity })}
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          Storage Class <Tooltip term="s3" />
        </label>
        <select
          className="form-control"
          value={config.storageClass}
          onChange={(e) => setConfig({ ...config, storageClass: e.target.value })}
        >
          {s3StorageClasses.map(cls => (
            <option key={cls.value} value={cls.value}>{cls.label}</option>
          ))}
        </select>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Storage (GB)</label>
          <input
            type="number"
            className="form-control"
            min="1"
            value={config.storageGB}
            onChange={(e) => setConfig({ ...config, storageGB: parseInt(e.target.value) || 1 })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Requests/Month</label>
          <input
            type="number"
            className="form-control"
            min="0"
            value={config.requestsPerMonth}
            onChange={(e) => setConfig({ ...config, requestsPerMonth: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <button className="btn btn-primary btn-block" onClick={handleSubmit}>
        ➕ Add to Cart
      </button>
    </div>
  );
}

function RDSForm({ onAdd }) {
  const [config, setConfig] = useState({
    name: 'Database',
    engine: 'postgres',
    instanceType: 'db.t3.medium',
    storageGB: 50,
    multiAZ: false,
    quantity: 1
  });

  const handleSubmit = () => {
    onAdd({ type: 'rds', ...config });
  };

  return (
    <div className="service-card-body">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Database Name</label>
          <input
            type="text"
            className="form-control"
            value={config.name}
            onChange={(e) => setConfig({ ...config, name: e.target.value })}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Instances</label>
          <QuantityInput
            value={config.quantity}
            onChange={(quantity) => setConfig({ ...config, quantity })}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Engine</label>
          <select
            className="form-control"
            value={config.engine}
            onChange={(e) => setConfig({ ...config, engine: e.target.value })}
          >
            {rdsEngines.map(engine => (
              <option key={engine.value} value={engine.value}>
                {engine.icon} {engine.label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            Instance Type <Tooltip term="rds" />
          </label>
          <select
            className="form-control"
            value={config.instanceType}
            onChange={(e) => setConfig({ ...config, instanceType: e.target.value })}
          >
            {rdsInstanceTypes.map(type => (
              <option key={type.value} value={type.value}>{type.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Storage (GB)</label>
          <input
            type="number"
            className="form-control"
            min="20"
            value={config.storageGB}
            onChange={(e) => setConfig({ ...config, storageGB: parseInt(e.target.value) || 20 })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Availability <Tooltip term="multiAZ" />
          </label>
          <select
            className="form-control"
            value={config.multiAZ ? 'multi' : 'single'}
            onChange={(e) => setConfig({ ...config, multiAZ: e.target.value === 'multi' })}
          >
            <option value="single">Single-AZ</option>
            <option value="multi">Multi-AZ</option>
          </select>
        </div>
      </div>

      <button className="btn btn-primary btn-block" onClick={handleSubmit}>
        ➕ Add to Cart
      </button>
    </div>
  );
}

function DataTransferForm({ onAdd }) {
  const [config, setConfig] = useState({
    name: 'Data Transfer',
    ingressGB: 0,
    egressGB: 100
  });

  const handleSubmit = () => {
    onAdd({ type: 'dataTransfer', ...config });
  };

  return (
    <div className="service-card-body">
      <div className="form-row">
        <div className="form-group">
          <label className="form-label">
            Ingress (GB) <Tooltip text="Data IN (free)" />
          </label>
          <input
            type="number"
            className="form-control"
            min="0"
            value={config.ingressGB}
            onChange={(e) => setConfig({ ...config, ingressGB: parseInt(e.target.value) || 0 })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">
            Egress (GB) <Tooltip text="Data OUT (costs $)" />
          </label>
          <input
            type="number"
            className="form-control"
            min="0"
            value={config.egressGB}
            onChange={(e) => setConfig({ ...config, egressGB: parseInt(e.target.value) || 0 })}
          />
        </div>
      </div>

      <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: 'var(--space-md)' }}>
        💡 First 100 GB/month egress is free tier eligible
      </p>

      <button className="btn btn-primary btn-block" onClick={handleSubmit}>
        ➕ Add to Cart
      </button>
    </div>
  );
}

export default function ServiceCard({ type }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToCart } = useCart();

  const handleAdd = (config) => {
    addToCart(config);
    setIsExpanded(false);
  };

  const renderForm = () => {
    switch (type) {
      case 'ec2': return <EC2Form onAdd={handleAdd} />;
      case 's3': return <S3Form onAdd={handleAdd} />;
      case 'rds': return <RDSForm onAdd={handleAdd} />;
      case 'dataTransfer': return <DataTransferForm onAdd={handleAdd} />;
      default: return null;
    }
  };

  const iconData = serviceIcons[type];

  return (
    <div className={`service-card ${isExpanded ? 'expanded' : ''}`}>
      <div className="service-card-header">
        <div className={`service-icon ${type}`}>
          {iconData.type === 'image' ? (
            <img src={iconData.src} alt={iconData.alt} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
          ) : (
            iconData.icon
          )}
        </div>
        <div className="service-info">
          <h3>{type === 'dataTransfer' ? 'Data Transfer' : type.toUpperCase()}</h3>
          <p>{serviceDescriptions[type]}</p>
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? '✕ Close' : '+ Add'}
        </button>
      </div>

      {isExpanded && renderForm()}
    </div>
  );
}
