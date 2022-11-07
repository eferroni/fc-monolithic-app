import { Model, PrimaryKey, Table, Column } from "sequelize-typescript";

@Table({
    tableName: 'clientes',
    timestamps: false
})
export default class ClientModel extends Model {
    @PrimaryKey
    @Column({allowNull: false})
    id: string;
   
    @Column({allowNull: false})
    name: string;

    @Column({allowNull: false})
    email: string;

    @Column({allowNull: false})
    address: string;

    @Column({allowNull: false})
    createdAt: Date;

    @Column({allowNull: false})
    updatedAt: Date;
}

