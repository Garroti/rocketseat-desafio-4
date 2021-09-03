import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'

import { CreateUserUseCase } from '../createUser/CreateUserUseCase'
import { ShowUserProfileUseCase } from './ShowUserProfileUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(inMemoryUsersRepository);
  });

  it("should be able to show a user ", async () => {

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

    const user_id = user.id || ''

    const show = await showUserProfileUseCase.execute(user_id);

    expect(show).toHaveProperty("id");
    expect(show).toHaveProperty("email");
    expect(show).toHaveProperty("name");
    expect(show).toHaveProperty("password");
  });
});