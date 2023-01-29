import { BadRequestException } from "@nestjs/common";
import { NotFoundException } from "@nestjs/common/exceptions";
import { Test } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { User } from "./user.entity";
import { UsersService } from "./users.service";

describe('AuthService', () => {

    let service: AuthService;
    let fakeUsersService: Partial<UsersService>;

    beforeEach(async () => {
        const users: User[] = []
        fakeUsersService = {
            find: (email: string) => {
                const filteredUser = users.filter(user => user.email === email)
                return Promise.resolve(filteredUser)
            },
            create: (email, password: string) => {
                const user = { id: Math.floor(Math.random() * 999999), email, password } as
                    User
                users.push(user)
                return Promise.resolve(user)
            }

        }
        const module = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: UsersService,
                    useValue: fakeUsersService
                }
            ]
        }).compile()

        service = module.get(AuthService)
    })

    it(' can create an instance of auth service', async () => {
        // create a fake copy of the user service
        expect(service).toBeDefined()
    })

    it('creates a new user with a salted and hashed password', async () => {
        const user = await service.signup('asljd@ahdjh.com', 'asft')

        expect(user.password).not.toEqual('asft')
        const [salt, hash] = user.password.split('.')
        expect(salt).toBeDefined();
        expect(hash).toBeDefined();
    })


    it('throws an error if user signs up with email that is in use', async () => {
        await service.signup('asdf@asdf.com', 'asdf')
        await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
            BadRequestException,
        );
    });



    it('throws if signin is called with an unused email', async () => {
        await expect(service.signin('sdjhshjdj@.com', 'sdjdgsh')
        ).rejects.toThrow(NotFoundException)
    })

    it('throws if an invalid password is provided', async () => {
        await service.signup('skjhdghj@sdjh.com', 'dkjshjkjd')
        await expect(
            service.signin('skjhdghj@sdjh.com', 'dskjhfjd')
        ).rejects.toThrow(BadRequestException)
    })

    it('returns a user if correct password is provided', async () => {
        await service.signup('asdf@asdf.com', 'password')

        const user = await service.signin('asdf@asdf.com', 'password')
        expect(user).toBeDefined()


    })


})