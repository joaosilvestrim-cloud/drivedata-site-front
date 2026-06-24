import { EmailIsConfirmedErrorName } from '@/common/consts/errors';

export class EmailIsConfirmedError extends Error {
  constructor() {
    super('O email já está confirmado');
    this.name = EmailIsConfirmedErrorName;
  }
}
