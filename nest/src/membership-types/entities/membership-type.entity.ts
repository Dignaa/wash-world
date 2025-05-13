import { Membership } from "src/memberships/entities/membership.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class MembershipType {

      @PrimaryGeneratedColumn()
      id: number;

      @Column()
      type: string;
    
      @Column({ type: 'float' })
      price: number;

      @OneToMany(() => Membership, (membership) => membership.membershipType)
      membership: Membership[];
}
