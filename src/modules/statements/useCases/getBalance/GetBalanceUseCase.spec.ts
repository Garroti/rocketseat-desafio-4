import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'

import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase'
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase'
import { GetBalanceUseCase } from './GetBalanceUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

describe("Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it("should be able to get a balance of an user ", async () => {

    const params = {
      name: "gabryel",
      email: "gabryel@mail.com",
      password: "123456",
    }

    const withdraw = 'withdraw' as OperationType;
    const deposit = 'deposit' as OperationType;

    const user = await createUserUseCase.execute({
      name: params.name,
      email: params.email,
      password: params.password
    });

    await createStatementUseCase.execute({
      user_id: user.id || '',
      type: deposit,
      amount: 100,
      description: 'test deposit statement' 
    });

    await createStatementUseCase.execute({
      user_id: user.id || '',
      type: withdraw,
      amount: 80,
      description: 'test withdraw statement' 
    });

    const user_id = user.id || ''

    const balance = await getBalanceUseCase.execute({ user_id })

    expect(balance).toHaveProperty("statement");
    expect(balance.statement.length).toBeGreaterThan(1)
    expect(balance).toHaveProperty("balance");
    expect(balance.balance).toBe(20);
  });

});