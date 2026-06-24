export interface PreviewSolutionsSectionProps {
  className?: string;
}

export interface ImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  rotate?: string;
}

export interface ImagePosition {
  bottom?: string;
  right?: string;
  rotate?: string;
}

export interface PreviewSolutionCardProps {
  backgroundImage: string;
  title: string;
  logo?: ImageProps;
  mockupImage: ImageProps;
  gridColumns?: string;
  imagePosition?: ImagePosition;
  imagePositionMobile?: ImagePosition;
}

