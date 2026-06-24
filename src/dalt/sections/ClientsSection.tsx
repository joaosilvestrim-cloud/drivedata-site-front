'use client';

import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { daltTheme } from '../theme';
import { clients } from '../content';

const scroll = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
`;

const Section = styled.section`
  padding: 6rem 1.5rem;
  background: ${daltTheme.colors.bg};
  overflow: hidden;
`;

const Inner = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const Label = styled.p`
  text-align: center;
  font-size: 0.6875rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: ${daltTheme.colors.textMuted};
  margin-bottom: 3.5rem;
  font-family: ${daltTheme.fonts.body};
`;

const MarqueeWrapper = styled.div`
  position: relative;
  overflow: hidden;
  mask-image: linear-gradient(
    90deg,
    transparent 0%,
    #000 8%,
    #000 92%,
    transparent 100%
  );

  &:hover .marquee-track {
    animation-play-state: paused;
  }
`;

const MarqueeTrack = styled.div`
  display: flex;
  width: max-content;
  animation: ${scroll} 30s linear infinite;
`;

const LogoGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4rem;
  padding: 0 2rem;
`;

const LogoItem = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  opacity: 0.55;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }

  img {
    height: 36px;
    width: auto;
    max-width: 140px;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }
`;

export function ClientsSection() {
  return (
    <Section>
      <Inner>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <Label>Expertise validada em operações globais</Label>
        </motion.div>

        <MarqueeWrapper>
          <MarqueeTrack className="marquee-track">
            {[0, 1].map((groupIndex) => (
              <LogoGroup key={groupIndex} aria-hidden={groupIndex === 1}>
                {clients.map((client) => (
                  <LogoItem key={`${client.name}-${groupIndex}`}>
                    <Image
                      src={client.logo}
                      alt={`${client.name} logo`}
                      width={140}
                      height={36}
                      style={{ height: '36px', width: 'auto', maxWidth: '140px' }}
                      unoptimized
                    />
                  </LogoItem>
                ))}
              </LogoGroup>
            ))}
          </MarqueeTrack>
        </MarqueeWrapper>
      </Inner>
    </Section>
  );
}
