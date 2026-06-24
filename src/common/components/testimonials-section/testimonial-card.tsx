'use client';

import { TestimonialModel } from "@/common/model/testimonial.model";
import Image from "next/image";
import { TestimonialAuthor, TestimonialAuthorInfo, TestimonialAuthorName, TestimonialAuthorRole, TestimonialAvatar, TestimonialCardContainer, TestimonialDescription } from "./styles";

export const TestimonialCard = ({
  clientName,
  clientCompany,
  clientAvatar,
  testimonial,
}: TestimonialModel) => {
  const initials = clientName
    .split(' ')
    .map(name => name[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <TestimonialCardContainer>
      <TestimonialAuthor>
        <TestimonialAvatar>
          {clientAvatar ? (
            <Image src={clientAvatar} alt={clientName} width={48} height={48} loading="lazy" quality={80} />
          ) : (
            initials
          )}
        </TestimonialAvatar>
        <TestimonialAuthorInfo>
          <TestimonialAuthorName>{clientName}</TestimonialAuthorName>
          {clientCompany && (
            <TestimonialAuthorRole>
              {clientCompany}
            </TestimonialAuthorRole>
          )}
        </TestimonialAuthorInfo>
      </TestimonialAuthor>
      <TestimonialDescription dangerouslySetInnerHTML={{ __html: testimonial }} />
    </TestimonialCardContainer>
  );
};

