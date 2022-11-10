import { BelongsTo, Column, ForeignKey, HasMany, Model, PrimaryKey, Table } from "sequelize-typescript";
import ClientModel from "../../client-adm/repository/client.model";
import OrderItemModel from "./order-item.model";


@Table({
    tableName: 'orders',
    timestamps: false
})
export default class OrderModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @Column({allowNull: false})
    declare status: string;

    @ForeignKey(() => ClientModel)
    @Column({ allowNull: false })
    declare client_id: string;
  
    @BelongsTo(() => ClientModel)
    declare client: ClientModel;

    @HasMany(() => OrderItemModel)
    declare products: OrderItemModel[];
}