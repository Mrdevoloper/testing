import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUsersService = {
      findOne: (id: number) => {
        return Promise.resolve({ id, email: 'asdf@asdf.com', password: 'password' } as User)
      },
      find: (email: string) => {
        return Promise.resolve([{ id: 1, email, password: 'asdf' } as User])
      },
      // remove: () => { },
      // update: () => { }
    }
    fakeAuthService = {
      // signup: () => { },
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 3, email, password } as User)
      }
    }


    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUsersService
        },
        {
          provide: AuthService,
          useValue: fakeAuthService
        }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAllusers returns a list of users with a given email', async () => {
    const users = await controller.findAllUsers('asdf@asdf.com')
    expect(users.length).toEqual(1)
    expect(users[0].email).toEqual('asdf@asdf.com')
  })
  it('findUser returns a single user with a given id ', async () => {
    const user = await controller.findUser('1')
    expect(user).toBeDefined()
  })

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUsersService.findOne = () => null
    await expect(controller.findUser('1')).rejects.toThrow(NotFoundException);
  })

  it('signin updates session objects and returns user', async () => {
    const session = {
      userId: -10
    }
    const user = await controller.signin({ email: 'asdf@asdf.com', password: 'lkjhg' },
      session
    );
    expect(user.id).toEqual(3)
    expect(session.userId).toEqual(3)
  })

});
