export type TabId = 'timer' | 'converter';

export type UnitType = 'length' | 'weight' | 'temperature';

export interface BudgetItem {
  id: string;
  name: string;
  amount: number;
}