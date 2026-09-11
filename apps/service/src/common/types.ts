import { ExpenseSchema, LocationSchema } from './schema/user';

export type LocationWithExpenses = LocationSchema &
  Pick<
    ExpenseSchema,
    'expenseCode' | 'expenseName' | 'price' | 'inUsed' | 'type'
  > & { initialUnit: number; currentUnit: number; unitName: string };
