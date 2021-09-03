import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { AuthenticateUserUseCase } from './AuthenticateUserUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to authenticate a user ", async () => {

    const params = {
      name: "gabryel",
      email: "gabryel@mail.com",
      password: "123456",
    }

    const user = await createUserUseCase.execute({
      name: params.name,
      email: params.email,
      password: params.password
    });

    const auth = await authenticateUserUseCase.execute({
      email: user.email,
      password: params.password
    });

    expect(auth).toHaveProperty("user");
    expect(auth).toHaveProperty("token");
  });
});