import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'

import { CreateUserUseCase } from './CreateUserUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to create a nem user ", async () => {

    const user = await createUserUseCase.execute({
      name: "gabryel",
      email: "gabryel@mail.com",
      password: "123456",
    });

    expect(user).toHaveProperty("id");
    expect(user).toHaveProperty("name");
    expect(user).toHaveProperty("email");
    expect(user).toHaveProperty("password");
  });
});