"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Sparkles, LogOut, BookOpen } from "lucide-react"
import { CreateListDialog } from "./create-list-dialog"
import { StudyListCard } from "./study-list-card"
import { useAuth } from "@/lib/auth"
import { supabase, type StudyList } from "@/lib/supabase"
import { useTheme } from "next-themes"

export function Dashboard() {
  const [lists, setLists] = useState<StudyList[]>([])
  const [loading, setLoading] = useState(true)
  const { user, signOut } = useAuth()
  const { theme, setTheme } = useTheme()

  const loadLists = async () => {
    try {
      const { data, error } = await supabase.from("study_lists").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setLists(data || [])
    } catch (error) {
      console.error("Error loading lists:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLists()
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <div className={"min-h-screen bg-zinc-100 dark:bg-zinc-900 transition-colors duration-300"}>
      <header className="backdrop-blur bg-white/80 dark:bg-zinc-950/80 border-b border-zinc-200 dark:border-zinc-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="bg-zinc-900 dark:bg-zinc-800 rounded-full p-2 shadow-lg">
                <Sparkles className="h-8 w-8 text-white drop-shadow" />
              </div>
              <div>
                <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">FocusFlow</h1>
                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium">Organize e turbine seus estudos</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-zinc-700 dark:text-zinc-200 font-medium">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2 border-zinc-300 dark:border-zinc-700 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-800">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
              <button
                aria-label="Alternar tema"
                className="ml-2 p-2 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 transition-colors"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71m16.97 0l-.71-.71M4.05 4.93l-.71-.71M21 12h-1M4 12H3m9 5a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                ) : (
                  <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-zinc-900 dark:text-white">Suas Listas de Estudo</h2>
            <p className="text-zinc-600 dark:text-zinc-400">Gerencie seus ciclos de estudo e acompanhe seu progresso</p>
          </div>
          <CreateListDialog onListCreated={loadLists} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-white/70">Carregando suas listas...</div>
          </div>
        ) : lists.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">Nenhuma lista criada</h3>
            <p className="text-white/70 mb-4">Crie sua primeira lista de estudos para começar</p>
            <CreateListDialog onListCreated={loadLists} />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <StudyListCard key={list.id} list={list} onListDeleted={loadLists} collapsible />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
