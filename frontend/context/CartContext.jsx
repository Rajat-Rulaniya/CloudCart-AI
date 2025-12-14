import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [region, setRegion] = useState('us-east-1');
  const [productionMode, setProductionMode] = useState(false);

  const generateId = () => Math.random().toString(36).substr(2, 9);

  const addToCart = (service) => {
    const newItem = {
      ...service,
      id: generateId(),
      addedAt: new Date().toISOString()
    };
    setCartItems(prev => [...prev, newItem]);
    return newItem.id;
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const updateCartItem = (id, updates) => {
    setCartItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const loadDemoArchitecture = () => {
    const demoItems = [
      {
        id: generateId(),
        type: 'ec2',
        name: 'Web Server',
        instanceType: 'm5.large',
        hoursPerDay: 24,
        pricingType: 'on-demand',
        os: 'linux',
        quantity: 2
      },
      {
        id: generateId(),
        type: 'ec2',
        name: 'API Server',
        instanceType: 't3.large',
        hoursPerDay: 24,
        pricingType: 'on-demand',
        os: 'linux',
        quantity: 2
      },
      {
        id: generateId(),
        type: 's3',
        name: 'Application Storage',
        storageClass: 'standard',
        storageGB: 500,
        requestsPerMonth: 100000
      },
      {
        id: generateId(),
        type: 'rds',
        name: 'Primary Database',
        engine: 'postgres',
        instanceType: 'db.r5.large',
        storageGB: 100,
        multiAZ: true
      },
      {
        id: generateId(),
        type: 'dataTransfer',
        name: 'Data Transfer',
        ingressGB: 50,
        egressGB: 200
      }
    ];

    setCartItems(demoItems);
    setRegion('us-east-1');
  };

  const itemCount = cartItems.length;

  const isEmpty = cartItems.length === 0;

  return (
    <CartContext.Provider value={{
      cartItems,
      region,
      setRegion,
      productionMode,
      setProductionMode,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      loadDemoArchitecture,
      itemCount,
      isEmpty
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
