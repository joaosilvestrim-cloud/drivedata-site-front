import { PendingEmailConfirmationErrorName } from '@/common/consts/errors';

export class PendingEmailConfirmationError extends Error {
  static readonly message = 'Aguardando confirmação do email';
  constructor() {
    super(PendingEmailConfirmationError.message);
    this.name = PendingEmailConfirmationErrorName;
  }
}
