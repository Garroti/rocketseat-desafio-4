import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateStatementUseCase } from './CreateStatementUseCase';

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer',
}

export class CreateStatementController {
  async execute(request: Request, response: Response) {

    let user_id
    let amount
    let description
    let sender_id

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 1] as OperationType;

    if(type === 'transfer') {
      user_id = request.user.id;
      amount = request.body.amount;
      description = request.body.description;
      sender_id = ''
    } else {
      user_id = request.params.user_id;
      amount = request.body.amount;
      description = request.body.description;
      sender_id = request.user.id;
    }

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      type,
      amount,
      description,
      sender_id
    });

    return response.status(201).json(statement);
  }
}
