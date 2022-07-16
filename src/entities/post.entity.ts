import { Entity, Column, PrimaryGeneratedColumn, JoinColumn, ManyToOne } from 'typeorm'
import { User } from './user.entity'

@Entity('posts')
export class Post{
    @PrimaryGeneratedColumn({type: "integer"})
    ID: number

    @Column({type: "integer"})
    userID: number

    @Column({type: "text"})
    text: string

    @Column()
    date: Date

    @Column()
    filenames: string
}