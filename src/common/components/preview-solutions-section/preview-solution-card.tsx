'use client';

import Image from "next/image";
import { CardPreviewSolutions, CardPreviewSolutionsContent, CardPreviewSolutionsImage, CardPreviewSolutionsLogo, CardPreviewSolutionsTitle } from "./styles";
import { PreviewSolutionCardProps } from "./types";

export const PreviewSolutionCard = ({
  backgroundImage,
  title,
  logo,
  mockupImage,
  gridColumns,
  imagePosition,
  imagePositionMobile,
}: PreviewSolutionCardProps) => {
  return (
    <CardPreviewSolutions backgroundImage={backgroundImage}>
      <CardPreviewSolutionsContent gridColumns={gridColumns}>
        <CardPreviewSolutionsTitle dangerouslySetInnerHTML={{ __html: title }} />
        {logo && (
          <CardPreviewSolutionsLogo>
            <Image 
              src={logo.src} 
              alt={logo.alt} 
              width={logo.width} 
              height={logo.height}
              loading="lazy"
              quality={85}
            />
          </CardPreviewSolutionsLogo>
        )}
      </CardPreviewSolutionsContent>
      <CardPreviewSolutionsImage 
        bottom={imagePosition?.bottom} 
        right={imagePosition?.right}
        rotate={imagePosition?.rotate}
        bottomMobile={imagePositionMobile?.bottom}
        rightMobile={imagePositionMobile?.right}
        rotateMobile={imagePositionMobile?.rotate}
      >
        <Image 
          src={mockupImage.src} 
          alt={mockupImage.alt} 
          width={mockupImage.width} 
          height={mockupImage.height}
          loading="lazy"
          quality={85}
        />
      </CardPreviewSolutionsImage>
    </CardPreviewSolutions>
  );
};

