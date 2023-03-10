import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    //See if email in use
    const user = await this.usersService.find(email);

    if (user.length > 0) {
      throw new BadRequestException('email in use');
    }

    //Hash the user password
    //Generate salt
    const salt = randomBytes(8).toString('hex');

    //Hash the salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const newPassword = `${salt}.${hash.toString('hex')}`;
    //Create a new user
    const response = await this.usersService.create(email, newPassword);

    //Return the user
    return response;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('user not found');
    }

    const [salt,storeHash] = user.password.split('.');

    const hash = (await scrypt(password,salt,32)) as Buffer; 

    if(storeHash === hash.toString('hex')){
      return user
    }else{
      throw new BadRequestException('Bad password ');
    }
  }
}
