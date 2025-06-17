import { BeverageItem } from '../types';

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
};

export const calculateTotalItems = (items: BeverageItem[]): number => {
  return items.reduce((total, item) => total + item.quantity, 0);
};

export const addItemToCart = (items: BeverageItem[], newItem: Omit<BeverageItem, 'id'>): BeverageItem[] => {
  const existingItemIndex = items.findIndex(item => 
    item.type === newItem.type && 
    item.name === newItem.name && 
    item.milk === newItem.milk && 
    item.sugar === newItem.sugar
  );

  if (existingItemIndex > -1) {
    const updatedItems = [...items];
    updatedItems[existingItemIndex].quantity += newItem.quantity;
    return updatedItems;
  }

  return [...items, { ...newItem, id: generateId() }];
};

export const removeItemFromCart = (items: BeverageItem[], itemId: string): BeverageItem[] => {
  return items.filter(item => item.id !== itemId);
};

export const updateItemQuantity = (items: BeverageItem[], itemId: string, quantity: number): BeverageItem[] => {
  if (quantity <= 0) {
    return removeItemFromCart(items, itemId);
  }
  
  return items.map(item => 
    item.id === itemId ? { ...item, quantity } : item
  );
};