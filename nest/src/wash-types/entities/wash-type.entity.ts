import { Wash } from "src/washes/entities/wash.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WashType {

      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      type: string;
    
      @Column({ type: 'float' })
      price: number;

      @OneToMany(() => Wash, (wash) => wash.washType)
      washes: Wash[];
}
