import { AccessDeniedErrorName } from '@/common/consts/errors';

export class AccessDeniedError extends Error {
  constructor() {
    super('Acesso negado');
    this.name = AccessDeniedErrorName;
  }
}
