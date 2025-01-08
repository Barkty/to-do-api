import { ClientSession } from 'mongoose';
import User from './model';
import { IUser } from '../../shared/interfaces';

export interface AuthRepository {
    getOne(param: string): Promise<IUser | null>;
    create(param: Partial<IUser>): Promise<IUser | null>;
    update(param: Partial<IUser>, session?: ClientSession): Promise<IUser | null>;
}

export class AuthRepositoryImpl implements AuthRepository {
    public async getOne(param: string): Promise<IUser | null> {
        const filter = {
            $or: [
                { email: param },
                { _id: param },
                { phone: param },
                { username: param },
            ]
        }
        const user = await User.findOne(filter).lean();

        return user;
    }

    public async create(param: Partial<IUser>): Promise<IUser | null> {

        const user = await new User(param).save()

        return user;
    }

    public async update(param: Partial<IUser>, session?: ClientSession): Promise<IUser | null> {
        const { _id, ...rest } = param;
        return await User.findByIdAndUpdate({_id}, { $set: rest }, { new: true, session }).lean();
    }
}

const authRepository = new AuthRepositoryImpl();

export default authRepository;
