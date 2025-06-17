export interface BeverageItem {
  id: string;
  type: 'coffee' | 'tea' | 'water';
  name: string;
  quantity: number;
  milk?: boolean;
  sugar?: number;
}

export interface Meeting {
  dateTime: string;
  duration: number;
  boardroom: string;
  userName: string;
  beverages: BeverageItem[];
  notes?: string;
  recurring: boolean;
}

export type BeverageCategory = 'coffee' | 'tea' | 'water';