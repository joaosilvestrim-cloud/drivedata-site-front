import { TestimonialModel } from '@/common/model/testimonial.model';

export type FindManyTestimonialParams = {
  search?: string;
};

export type FindManyTestimonialResult = TestimonialModel[];

