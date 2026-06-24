import styled from '@emotion/styled';
import { theme } from '../../theme';

export const StyledContainer = styled.div<{
  maxWidth: string;
  padding: string;
}>`
  width: 100%;
  max-width: ${(props) => props.maxWidth};
  margin: 0 auto;
  padding: ${(props) => props.padding};

  @media (min-width: ${theme.breakpoints.sm}) {
    padding: ${(props) => (props.padding === '0' ? '0' : props.padding)};
  }

  @media (min-width: ${theme.breakpoints.lg}) {
    padding: ${(props) => (props.padding === '0' ? '0' : props.padding)};
  }
`;
