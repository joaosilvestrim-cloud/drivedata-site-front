'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Número que conta até o valor quando entra na tela.
 *
 * Recebe o texto já pronto ("73%", "+340", "<30d") e anima só a parte numérica,
 * preservando prefixo e sufixo. Respeita quem pede menos movimento e tem um
 * timer de segurança: com a aba em segundo plano o requestAnimationFrame não
 * roda, e sem isso o número ficaria parado em zero.
 */

const PARTS = /^(\D*)([\d.,]+)(.*)$/

export function CountUp({ value, ms = 1200 }: { value: string; ms?: number }) {
  const match = value.match(PARTS)
  const ref = useRef<HTMLSpanElement>(null)
  const [shown, setShown] = useState<number | null>(null)

  const prefix = match?.[1] ?? ''
  const raw    = match?.[2] ?? ''
  const suffix = match?.[3] ?? ''
  // Aceita "1.234" e "12,5" mantendo o formato original na hora de exibir.
  const target = raw ? Number(raw.replace(/\./g, '').replace(',', '.')) : NaN
  const decimals = raw.includes(',') ? (raw.split(',')[1]?.length ?? 0) : 0
  const grouped = raw.includes('.')

  useEffect(() => {
    if (!isFinite(target)) return
    const el = ref.current
    if (!el) return

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setShown(target); return }

    let raf: number | null = null
    let safety: ReturnType<typeof setTimeout> | null = null
    let done = false
    const finish = () => { if (!done) { done = true; setShown(target) } }

    const run = () => {
      const start = performance.now()
      const tick = (now: number) => {
        const p = Math.min(1, (now - start) / ms)
        const eased = 1 - Math.pow(1 - p, 3)
        setShown(target * eased)
        if (p < 1) raf = requestAnimationFrame(tick)
        else finish()
      }
      raf = requestAnimationFrame(tick)
      safety = setTimeout(finish, ms + 200)
    }

    const io = new IntersectionObserver(entries => {
      if (entries[0]?.isIntersecting) { io.disconnect(); run() }
    }, { threshold: 0.4 })
    io.observe(el)

    return () => {
      io.disconnect()
      if (raf) cancelAnimationFrame(raf)
      if (safety) clearTimeout(safety)
    }
    // `match` fica FORA das dependências de propósito: é um array novo a cada
    // render, e incluí-lo reiniciava a animação sem parar (o número travava no
    // primeiro quadro). `target` e `ms` já identificam o que precisa reanimar.
  }, [target, ms])

  // Texto sem número (ou formato inesperado) passa direto.
  if (!match || !isFinite(target)) return <>{value}</>

  const n = shown ?? 0
  const text = grouped
    ? Math.round(n).toLocaleString('pt-BR')
    : n.toFixed(decimals).replace('.', ',')

  return (
    <span ref={ref}>
      {prefix}{text}{suffix}
    </span>
  )
}
