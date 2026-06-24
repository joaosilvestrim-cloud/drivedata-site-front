import { UnexpectedErrorName } from '@/common/consts/errors';

export class UnexpectedError extends Error {
  constructor() {
    super('Algo de errado aconteceu. Tente novamente mais tarde');
    this.name = UnexpectedErrorName;
  }
}
