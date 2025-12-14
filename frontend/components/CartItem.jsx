const serviceIcons = {
  ec2: { type: 'image', src: '/icons/ec2.jpeg', alt: 'EC2' },
  s3: { type: 'image', src: '/icons/s3.jpeg', alt: 'S3' },
  rds: { type: 'image', src: '/icons/rds.png', alt: 'RDS' },
  dataTransfer: { type: 'emoji', icon: '🌐' }
};

function formatConfig(item) {
  switch (item.type) {
    case 'ec2':
      return [
        item.instanceType,
        `${item.hoursPerDay}h/day`,
        item.pricingType,
        item.os
      ];
    case 's3':
      return [
        item.storageClass,
        `${item.storageGB} GB`,
        `${(item.requestsPerMonth / 1000).toFixed(0)}K req`
      ];
    case 'rds':
      return [
        item.engine,
        item.instanceType?.replace('db.', ''),
        `${item.storageGB} GB`,
        item.multiAZ ? 'Multi-AZ' : 'Single-AZ'
      ];
    case 'dataTransfer':
      return [
        `${item.ingressGB} GB in`,
        `${item.egressGB} GB out`
      ];
    default:
      return [];
  }
}

export default function CartItem({ item, costs, onRemove }) {
  const iconData = serviceIcons[item.type] || { type: 'emoji', icon: '☁️' };
  const configItems = formatConfig(item);
  const quantity = item.quantity || 1;

  const itemCosts = costs?.perService?.find(s => s.id === item.id) || {
    hourly: 0,
    daily: 0,
    monthly: 0
  };

  const totalHourly = itemCosts.hourly * quantity;
  const totalDaily = itemCosts.daily * quantity;
  const totalMonthly = itemCosts.monthly * quantity;

  return (
    <div className="cart-item animate-in">
      <div className="cart-item-icon">
        {iconData.type === 'image' ? (
          <img src={iconData.src} alt={iconData.alt} style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '8px' }} />
        ) : (
          iconData.icon
        )}
      </div>

      <div className="cart-item-details">
        <div className="cart-item-header">
          <div>
            <h3 className="cart-item-name">
              {item.name || item.type.toUpperCase()}
              {quantity > 1 && (
                <span className="quantity-badge">×{quantity}</span>
              )}
            </h3>
            <div className="cart-item-config">
              {configItems.map((config, idx) => (
                <span key={idx}>{config}</span>
              ))}
            </div>
          </div>

          <div className="cart-item-actions">
            <button
              className="btn btn-outline btn-sm btn-icon"
              onClick={() => onRemove(item.id)}
              title="Remove"
            >
              🗑️
            </button>
          </div>
        </div>

        <div className="cart-item-costs">
          <div className="cost-block">
            <div className="cost-label">Hourly</div>
            <div className="cost-value">${totalHourly.toFixed(4)}</div>
          </div>
          <div className="cost-block">
            <div className="cost-label">Daily</div>
            <div className="cost-value">${totalDaily.toFixed(2)}</div>
          </div>
          <div className="cost-block">
            <div className="cost-label">Monthly</div>
            <div className="cost-value">${totalMonthly.toFixed(2)}</div>
          </div>
          {quantity > 1 && (
            <div className="cost-block">
              <div className="cost-label">Each</div>
              <div className="cost-value" style={{ color: 'var(--text-secondary)' }}>
                ${itemCosts.monthly.toFixed(2)}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
