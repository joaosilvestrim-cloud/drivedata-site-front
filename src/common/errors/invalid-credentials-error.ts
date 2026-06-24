import { InvalidCredentialsErrorName } from '@/common/consts/errors';

export class InvalidCredentialsError extends Error {
  static readonly message = 'Credenciais inválidas';
  constructor() {
    super(InvalidCredentialsError.message);
    this.name = InvalidCredentialsErrorName;
  }
}
