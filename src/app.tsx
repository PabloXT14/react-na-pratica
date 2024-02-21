import { Plus } from 'lucide-react'

export function App() {
  return (
    <div className="space-y-8 py-10">
      <div>header abas</div>

      <main className="mx-auto max-w-6xl space-y-5">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold">Tags</h1>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-teal-300 px-1.5 py-1 text-xs font-medium text-teal-950">
            <Plus className="size-3" />
            Create new
          </button>
        </div>
      </main>
    </div>
  )
}
