import { Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { LocationSchema } from './location';
import { TenantSchema } from './tenant';

@Table({ tableName: 'tenant_locations', timestamps: false })
export class TenantLocationSchema extends Model {
    @PrimaryKey
    @ForeignKey(() => TenantSchema)
    @Column
    tenantCode: number;

    @PrimaryKey
    @ForeignKey(() => LocationSchema)
    @Column
    locationCode: number;
}

export type TenantLocationModel = typeof TenantLocationSchema;
