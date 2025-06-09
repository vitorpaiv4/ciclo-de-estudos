// Página de confirmação de cadastro para Supabase Auth

export default function AuthConfirmed() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <div className="max-w-md w-full bg-zinc-900 rounded-none shadow-xl p-8 flex flex-col items-center gap-6 border border-zinc-800">
        <svg width="48" height="48" fill="none" viewBox="0 0 24 24" className="text-green-400 mb-2">
          <path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h1 className="text-2xl font-bold">Cadastro confirmado!</h1>
        <p className="text-zinc-300 text-center">Sua conta foi ativada com sucesso.<br />Você já pode fazer login normalmente.</p>
        <a href="/" className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold transition-colors w-full text-center">Ir para o login</a>
      </div>
    </div>
  )
}
