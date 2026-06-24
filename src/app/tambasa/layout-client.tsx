'use client';

import { LegalHeader, LegalFooter } from '@/common/components';
import styled from '@emotion/styled';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
`;

export function TambasaLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LayoutContainer>
      <LegalHeader />
      {children}
      <LegalFooter />
    </LayoutContainer>
  );
}
