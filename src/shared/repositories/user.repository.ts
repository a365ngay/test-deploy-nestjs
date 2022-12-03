import { EntityRepository, Repository } from 'typeorm';
import { User } from '../../common';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    async getListNurseContainer(userId: string){
        if(userId && userId != ''){
            let sql = ` select u.* from "user" u 
            inner join warehouse w on u.id = w."nurseId" 
            where w."isDelete" = '0' and u."isDelete" = '0' and u.status = '1' and u.id = '${userId}' `
            return await this.manager.query(sql);
        }
        else {
            let sql = ` select u.* from "user" u 
            inner join warehouse w on u.id = w."nurseId" 
            where w."isDelete" = '0' and u."isDelete" = '0' and u.status = '1' `
            return await this.manager.query(sql);
        }
    }
}
