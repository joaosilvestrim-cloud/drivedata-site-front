export type TestimonialModel = {
  id: string;
  clientName: string;
  clientCompany?: string;
  clientAvatar?: string;
  /** link do YouTube ou MP4 enviado no admin */
  videoUrl?: string;
  testimonial: string;
  rating?: number;
  isActive: boolean;
  order: number;
  whitelabelId: string;
  createdAt: string;
  updatedAt: string;
  disabledAt?: string;
};

