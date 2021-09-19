import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'

import { CreateStatementUseCase } from './CreateStatementUseCase'
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase'
import { CreateStatementError } from "./CreateStatementError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to create a statement deposit ", async () => {

    const params = {
      name: "gabryel",
      email: "gabryel@mail.com",
      password: "123456",
    }

    const deposit = 'deposit' as OperationType;

    const user = await createUserUseCase.execute({
      name: params.name,
      email: params.email,
      password: params.password
    });

    const statementDeposit = await createStatementUseCase.execute({
      user_id: user.id || '',
      type: deposit,
      amount: 100,
      description: 'test deposit statement' 
    });

    expect(statementDeposit).toHaveProperty("id");
    expect(statementDeposit).toHaveProperty("user_id");
    expect(statementDeposit).toHaveProperty("type");
    expect(statementDeposit).toHaveProperty("amount");
    expect(statementDeposit).toHaveProperty("description");
  });

  it("should be able to create a statement withdraw ", async () => {

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

    const statementWithdraw = await createStatementUseCase.execute({
      user_id: user.id || '',
      type: withdraw,
      amount: 80,
      description: 'test withdraw statement' 
    });

    expect(statementWithdraw).toHaveProperty("id");
    expect(statementWithdraw).toHaveProperty("user_id");
    expect(statementWithdraw).toHaveProperty("type");
    expect(statementWithdraw).toHaveProperty("amount");
    expect(statementWithdraw).toHaveProperty("description");
  });

  it("should not be able to create a statement withdraw with insufficient funds ", () => {
    expect(async () => {
      const params = {
        name: "gabryel",
        email: "gabryel@mail.com",
        password: "123456",
      }
  
      const withdraw = 'withdraw' as OperationType;
  
      const user = await createUserUseCase.execute({
        name: params.name,
        email: params.email,
        password: params.password
      });
  
      await createStatementUseCase.execute({
        user_id: user.id || '',
        type: withdraw,
        amount: 120,
        description: 'test withdraw statement' 
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  })
});