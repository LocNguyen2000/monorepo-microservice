import { AutoIncrement, Column, DataType, Default, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table({ tableName: "clients", timestamps: false })
export class ClientSchema extends Model{
    @PrimaryKey
    @Column({ type: DataType.INTEGER, autoIncrement: true })
    id: number

    @Column
    name: string

    @Column
    clientId: string

    @Column
    clientSecret: string

    @Column
    redirectUris: string

    @Column
    accessTimeout: number

    @Column
    refreshTimeout: number
}

export type ClientModel = typeof ClientSchema