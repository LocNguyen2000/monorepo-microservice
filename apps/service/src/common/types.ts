import { ExpenseSchema, LocationSchema } from '@nhl/schemas/user';

export type LocationWithExpenses = LocationSchema &
  Pick<
    ExpenseSchema,
    'expenseCode' | 'expenseName' | 'price' | 'inUsed' | 'type'
  > & { initialUnit: number; currentUnit: number; unitName: string };
