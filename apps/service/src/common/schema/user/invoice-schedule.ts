import { Column, DataType, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';
import { BaseEntity } from '../base';
import { InvoiceSchema } from './invoice';
import { LocationSchema } from './location';

@Table({ tableName: 'invoice_schedules' })
export class InvoiceScheduleSchema extends BaseEntity {
    @PrimaryKey
    @ForeignKey(() => LocationSchema)
    @Column
    locationCode: number;

    @ForeignKey(() => InvoiceSchema)
    @Column
    invoiceCode?: number;

    @Column
    dueDay: number;

    @Column({ defaultValue: true })
    enabled: boolean;

    @Column({ type: DataType.DATE })
    lastNotifiedAt?: Date;

    @Column
    lastStatus?: string;

    @Column({ type: DataType.TEXT })
    lastError?: string;
}

export type InvoiceScheduleModel = typeof InvoiceScheduleSchema;
