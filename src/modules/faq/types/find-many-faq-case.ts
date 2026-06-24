import { FaqModel } from '@/common/model/faq.model';

export type FindManyFaqParams = {
  search?: string;
};

export type FindManyFaqResult = FaqModel[];

