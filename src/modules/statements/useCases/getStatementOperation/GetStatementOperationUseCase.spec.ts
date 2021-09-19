import { InMemoryUsersRepository } from '../../../users/repositories/in-memory/InMemoryUsersRepository'
import { InMemoryStatementsRepository } from '../../repositories/in-memory/InMemoryStatementsRepository'

import { CreateStatementUseCase } from '../createStatement/CreateStatementUseCase'
import { CreateUserUseCase } from '../../../users/useCases/createUser/CreateUserUseCase'
import { GetStatementOperationUseCase } from './GetStatementOperationUseCase'

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

describe("Statement", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it("should be able to get a statements of an user ", async () => {

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

    const statement = await createStatementUseCase.execute({
      user_id: user.id || '',
      type: deposit,
      amount: 100,
      description: 'test deposit statement' 
    });

    const user_id = user.id || ''
    const statement_id = statement.id || ''

    const getstatement = await getStatementOperationUseCase.execute({ user_id, statement_id })

    expect(getstatement).toHaveProperty("id");
    expect(getstatement).toHaveProperty("user_id");
    expect(getstatement).toHaveProperty("type");
    expect(getstatement).toHaveProperty("amount");
    expect(getstatement).toHaveProperty("description");
  });

});