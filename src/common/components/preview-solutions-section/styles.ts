import styled from '@emotion/styled';
import { theme } from '../../theme';

export const PreviewSolutionsSectionContainer = styled.section`
  width: 100%;
  padding: ${theme.spacing['5xl']} 0 ${theme.spacing['6xl']} 0;
  overflow: hidden;

  .swiper {
    overflow: visible;

    @media (max-width: ${theme.breakpoints.lg}) {
      overflow: hidden;
    }
  }

  .swiper-slide {
    height: auto;
    box-sizing: border-box;
  }
  
  .swiper-wrapper {
    @media (max-width: ${theme.breakpoints.lg}) {
      padding-bottom: ${theme.spacing.lg};
    }
  }
`;


export const CardPreviewSolutions = styled.div<{ backgroundImage: string }>`
  position: relative;
  width: 100%;
  height: 373px;
  border-radius: 8px;
  overflow: visible;
  padding: ${theme.spacing['2xl']} ${theme.spacing.lg};

  @media (max-width: ${theme.breakpoints.lg}) {
    margin-right: ${theme.spacing.lg};
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    opacity: 0.12;
    background-image: 
      linear-gradient(223.22deg, rgba(0, 0, 0, 0) 28.19%, rgba(0, 0, 0, 0.5) 94.59%),
      url(${props => props.backgroundImage});
    background-size: cover;
    background-position: center;
    backdrop-filter: blur(2.3160207271575928px);
    z-index: 0;
  }
`;

export const CardPreviewSolutionsContent = styled.div<{ gridColumns?: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: ${props => props.gridColumns || '1fr 1fr'};
  justify-content: space-between;
  z-index: 1;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${theme.spacing.md};
  }
`;

export const CardPreviewSolutionsTitle = styled.p`
  font-family: 'Satoshi', sans-serif;
  color: #FFFFFF;
  font-weight: ${theme.typography.fontWeight .normal};
  font-size: 20px;
  line-height: 120%;

  @media (max-width: ${theme.breakpoints.lg}) {
    font-size: 16px;
  }
`;

export const CardPreviewSolutionsLogo = styled.div`
  display: flex;
  justify-content: flex-end;

  @media (max-width: ${theme.breakpoints.lg}) {
    order: -1;
    justify-content: center;

    img {
      max-width: 100%;
      height: auto;
    }
  }
`;

export const CardPreviewSolutionsImage = styled.div<{ 
  bottom?: string; 
  right?: string; 
  rotate?: string;
  bottomMobile?: string;
  rightMobile?: string;
  rotateMobile?: string;
}>`
  position: absolute;
  bottom: ${props => props.bottom || '-120px'};
  right: ${props => props.right || '-120px'};
  z-index: 2;
  transform: rotate(${props => props.rotate || '0deg'});
  
  img {
    object-fit: contain;
  }

  @media (max-width: ${theme.breakpoints.lg}) {
    transform: rotate(${props => props.rotateMobile || props.rotate || '0deg'}) scale(0.6);
    bottom: ${props => props.bottomMobile || props.bottom || '-80px'} !important;
    right: ${props => props.rightMobile || props.right || '-80px'} !important;
    
    img {
      max-width: 300px;
      height: auto;
    }
  }

  @media (max-width: ${theme.breakpoints.sm}) {
    transform: rotate(${props => props.rotateMobile || props.rotate || '0deg'}) scale(0.5);
    bottom: ${props => props.bottomMobile || props.bottom || '-50px'} !important;
    right: ${props => props.rightMobile || props.right || '-50px'} !important;
    
    img {
      max-width: 250px;
      height: auto;
    }
  }
`;
