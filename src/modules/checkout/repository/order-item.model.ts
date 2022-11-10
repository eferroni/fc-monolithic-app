import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import OrderModel from "./order.model";


@Table({
    tableName: 'order_items',
    timestamps: false
})
export default class OrderItemModel extends Model {
    @PrimaryKey
    @Column
    declare id: string;

    @Column({allowNull: false})
    declare name: string;

    @Column({allowNull: false})
    declare description: string;
    
    @Column({allowNull: false})
    declare salesPrice: number;

    @ForeignKey(() => OrderModel)
    @Column({ allowNull: false })
    declare order_id: string;
  
    @BelongsTo(() => OrderModel)
    declare order: OrderModel;
}