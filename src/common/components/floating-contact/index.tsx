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
    <FloatingContactContainer
      type="button"
      onClick={handleContactClick}
      className={className}
      aria-label={t('previewSolutionsSection.floatingAria', {
        defaultValue: 'Abrir chat de contato com a DriveData',
      })}
    >
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

