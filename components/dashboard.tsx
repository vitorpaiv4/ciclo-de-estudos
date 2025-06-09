"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { BookOpen, LogOut } from "lucide-react"
import { CreateListDialog } from "./create-list-dialog"
import { StudyListCard } from "./study-list-card"
import { useAuth } from "@/lib/auth"
import { supabase, type StudyList } from "@/lib/supabase"

export function Dashboard() {
  const [lists, setLists] = useState<StudyList[]>([])
  const [loading, setLoading] = useState(true)
  const { user, signOut } = useAuth()

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
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <BookOpen className="h-6 w-6 text-blue-600" />
              <h1 className="text-xl font-bold">Ciclos de Estudo</h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground">{user?.email}</span>
              <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                Sair
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Suas Listas de Estudo</h2>
            <p className="text-muted-foreground">Gerencie seus ciclos de estudo e acompanhe seu progresso</p>
          </div>
          <CreateListDialog onListCreated={loadLists} />
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="text-muted-foreground">Carregando suas listas...</div>
          </div>
        ) : lists.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma lista criada</h3>
            <p className="text-muted-foreground mb-4">Crie sua primeira lista de estudos para começar</p>
            <CreateListDialog onListCreated={loadLists} />
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lists.map((list) => (
              <StudyListCard key={list.id} list={list} onListDeleted={loadLists} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
