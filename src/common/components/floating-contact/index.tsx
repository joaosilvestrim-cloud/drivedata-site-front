'use client';

import { useTypebot } from '@/common/providers/TypebotProvider';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FloatingAvatar, FloatingAvatarStatus, FloatingAvatarWrapper, FloatingBubble, FloatingBubbleText, FloatingContactContainer } from './styles';
import { FloatingContactProps } from './types';

export const FloatingContact = ({ className }: FloatingContactProps) => {
  const { t } = useTranslation();
  const { openTypebot } = useTypebot();
  const [showBubble, setShowBubble] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowBubble(true);
    }, 5000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const handleContactClick = () => {
    openTypebot();
  };

  return (
    <FloatingContactContainer onClick={handleContactClick} className={className}>
      <FloatingAvatarWrapper>
        <FloatingAvatar backgroundImage="/tamires-avatar.png" />
        <FloatingAvatarStatus />
      </FloatingAvatarWrapper>
      <FloatingBubble isVisible={showBubble}>
        <FloatingBubbleText>
          {t('previewSolutionsSection.floatingBubble')}
        </FloatingBubbleText>
      </FloatingBubble>
    </FloatingContactContainer>
  );
};

