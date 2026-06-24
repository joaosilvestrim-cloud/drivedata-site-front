import { ContactRequestModel } from '@/common/model/contact-request.model';

export type CreateContactRequestParams = {
  name: string;
  email: string;
  company: string;
  message: string;
};

export type CreateContactRequestResult = ContactRequestModel;

