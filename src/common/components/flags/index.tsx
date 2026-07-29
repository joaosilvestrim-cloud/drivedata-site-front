'use client';

/**
 * Bandeiras em SVG.
 *
 * Emoji de bandeira (🇧🇷) NÃO funciona no Windows: o sistema não tem os glifos e
 * mostra só as duas letras do país. Como boa parte do público acessa de Windows,
 * as bandeiras precisam ser desenhadas, e não texto.
 */

export type FlagCode = 'pt' | 'en' | 'es' | 'fr'

interface Props { code: FlagCode; size?: number; title?: string }

export function Flag({ code, size = 20, title }: Props) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    role: title ? ('img' as const) : ('presentation' as const),
    'aria-hidden': title ? undefined : true,
    style: { display: 'block', borderRadius: '50%', flexShrink: 0 },
  }

  if (code === 'pt') {
    return (
      <svg {...common}>
        {title && <title>{title}</title>}
        <circle cx="12" cy="12" r="12" fill="#009b3a" />
        <path d="M12 4.2 20.4 12 12 19.8 3.6 12z" fill="#fedf00" />
        <circle cx="12" cy="12" r="3.4" fill="#002776" />
        <path d="M8.9 10.8a6 6 0 0 1 6.3 1.5" stroke="#ffffff" strokeWidth="0.9" fill="none" strokeLinecap="round" />
      </svg>
    )
  }

  if (code === 'en') {
    return (
      <svg {...common}>
        {title && <title>{title}</title>}
        <defs>
          <clipPath id="dd-flag-en"><circle cx="12" cy="12" r="12" /></clipPath>
        </defs>
        <g clipPath="url(#dd-flag-en)">
          <rect width="24" height="24" fill="#ffffff" />
          {[0, 2, 4, 6, 8, 10].map(i => (
            <rect key={i} y={i * 1.85 + 0.9} width="24" height="1.85" fill="#b22234" />
          ))}
          <rect width="11" height="11" fill="#3c3b6e" />
          {[2, 5, 8].map(y => [2, 5, 8].map(x => (
            <circle key={`${x}-${y}`} cx={x} cy={y} r="0.8" fill="#ffffff" />
          )))}
        </g>
      </svg>
    )
  }

  if (code === 'es') {
    return (
      <svg {...common}>
        {title && <title>{title}</title>}
        <defs>
          <clipPath id="dd-flag-es"><circle cx="12" cy="12" r="12" /></clipPath>
        </defs>
        <g clipPath="url(#dd-flag-es)">
          <rect width="24" height="24" fill="#c60b1e" />
          <rect y="6" width="24" height="12" fill="#ffc400" />
        </g>
      </svg>
    )
  }

  // fr
  return (
    <svg {...common}>
      {title && <title>{title}</title>}
      <defs>
        <clipPath id="dd-flag-fr"><circle cx="12" cy="12" r="12" /></clipPath>
      </defs>
      <g clipPath="url(#dd-flag-fr)">
        <rect width="8" height="24" fill="#002395" />
        <rect x="8" width="8" height="24" fill="#ffffff" />
        <rect x="16" width="8" height="24" fill="#ed2939" />
      </g>
    </svg>
  )
}
