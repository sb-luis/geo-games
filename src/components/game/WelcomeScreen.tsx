'use client'

interface Props {
  onStart: () => void
  loading?: boolean
}

export function WelcomeScreen({ onStart, loading = false }: Props) {
  return (
    <main className="w-screen h-screen bg-[#f3f3f3] flex flex-col items-center justify-center gap-10">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-gray-800 tracking-tight">Guess the Country</h1>
        <p className="mt-3 text-gray-500 text-lg">Find 10 countries on the globe as fast as you can</p>
      </div>
      <button
        onClick={onStart}
        className={`bg-[#427cdf] text-white px-10 py-3.5 rounded-full font-semibold text-lg transition-all ${
          loading
            ? 'opacity-50 cursor-not-allowed'
            : 'hover:bg-[#3569c7] active:scale-95'
        }`}
      >
        {loading ? 'Loading…' : 'Start Game'}
      </button>
    </main>
  )
}
