// Estado de carregamento da rota /about. Sem isto, a navegação server-side fica
// "congelada" (clica e nada acontece) até as consultas do banco terminarem.
// Com este loading, o Next mostra feedback imediato enquanto a página renderiza.
export default function Loading() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#ffffff',
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          border: '4px solid #e2e8f0',
          borderTopColor: '#0ea5e9',
          borderRadius: '50%',
          animation: 'ddspin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes ddspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
