"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, Trash2, Trophy } from "lucide-react"
import { AddItemDialog } from "./add-item-dialog"
import { supabase, type StudyList, type StudyItem } from "@/lib/supabase"

interface StudyListCardProps {
  list: StudyList
  onListDeleted: () => void
  collapsible?: boolean
}

export function StudyListCard({ list, onListDeleted, collapsible }: StudyListCardProps) {
  const [items, setItems] = useState<StudyItem[]>([])
  const [cycles, setCycles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  const loadItems = async () => {
    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from("study_items")
        .select("*")
        .eq("list_id", list.id)
        .order("order_index")

      if (itemsError) throw itemsError

      const { data: cyclesData, error: cyclesError } = await supabase
        .from("study_cycles")
        .select("*")
        .eq("list_id", list.id)
        .order("cycle_number", { ascending: false })

      if (cyclesError) throw cyclesError

      setItems(itemsData || [])
      setCycles(cyclesData || [])
    } catch (error) {
      console.error("Error loading items:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadItems()
  }, [list.id])

  const toggleItem = async (itemId: string, completed: boolean) => {
    try {
      const { error } = await supabase
        .from("study_items")
        .update({ is_completed: completed, updated_at: new Date().toISOString() })
        .eq("id", itemId)

      if (error) throw error

      setItems(items.map((item) => (item.id === itemId ? { ...item, is_completed: completed } : item)))

      if (completed) {
        const updatedItems = items.map((item) => (item.id === itemId ? { ...item, is_completed: completed } : item))
        const allCompleted = updatedItems.length > 0 && updatedItems.every((item) => item.is_completed)

        if (allCompleted) {
          await completeCycle(updatedItems)
        }
      }
    } catch (error) {
      console.error("Error updating item:", error)
    }
  }

  const completeCycle = async (completedItems: StudyItem[]) => {
    try {
      const totalTime = completedItems.reduce((sum, item) => sum + item.estimated_time, 0)
      const nextCycleNumber = cycles.length + 1

      const { error: cycleError } = await supabase.from("study_cycles").insert({
        list_id: list.id,
        total_time: totalTime,
        cycle_number: nextCycleNumber,
      })

      if (cycleError) throw cycleError

      const { error: resetError } = await supabase
        .from("study_items")
        .update({ is_completed: false, updated_at: new Date().toISOString() })
        .eq("list_id", list.id)

      if (resetError) throw resetError

      await loadItems()

      alert(
        `🎉 Ciclo ${nextCycleNumber} concluído!\n\nTempo total: ${formatTime(totalTime)}\nTotal de ciclos: ${nextCycleNumber}`,
      )
    } catch (error) {
      console.error("Error completing cycle:", error)
    }
  }

  const deleteList = async () => {
    if (!confirm("Tem certeza que deseja excluir esta lista?")) return

    try {
      const { error } = await supabase.from("study_lists").delete().eq("id", list.id)

      if (error) throw error
      onListDeleted()
    } catch (error) {
      console.error("Error deleting list:", error)
    }
  }

  const completedItems = items.filter((item) => item.is_completed).length
  const totalItems = items.length
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0
  const totalTime = items.reduce((sum, item) => sum + item.estimated_time, 0)

  const formatDuration = (days: number) => {
    if (days === 1) return "1 dia"
    if (days < 7) return `${days} dias`
    if (days === 7) return "1 semana"
    if (days === 14) return "2 semanas"
    if (days === 30) return "1 mês"
    return `${days} dias`
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}min` : ""}`
    }
    return `${mins}min`
  }

  return (
    <Card className={`bg-white/70 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-lg transition-all duration-200 ${collapsed ? 'max-h-24 overflow-hidden' : ''}`}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">{list.title}</CardTitle>
          <CardDescription className="flex items-center gap-2 mt-1 text-zinc-500 dark:text-zinc-400">
            <Calendar className="h-4 w-4" />
            <span className="font-medium">{formatDuration(list.cycle_duration)}</span>
            <Clock className="h-4 w-4 ml-2" />
            <span className="font-medium">{formatTime(totalTime)}</span>
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          {collapsible && (
            <Button variant="ghost" size="icon" className="text-zinc-400 dark:text-zinc-500 hover:text-zinc-900 dark:hover:text-white" onClick={() => setCollapsed((c) => !c)} title={collapsed ? 'Expandir' : 'Recolher'}>
              <span className={`transition-transform duration-200 ${collapsed ? 'rotate-180' : ''}`}>▼</span>
            </Button>
          )}
          <Button variant="ghost" size="icon" className="text-zinc-400 dark:text-red-400 hover:text-red-500 dark:hover:text-red-300 hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={deleteList}>
            <Trash2 className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      {!collapsed && (
        <CardContent className="pt-0">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-zinc-700 dark:text-zinc-200">Itens de Estudo</h4>
            <AddItemDialog listId={list.id} onItemAdded={loadItems} />
          </div>
          {loading ? (
            <div className="text-center py-4 text-zinc-400 dark:text-zinc-500">Carregando...</div>
          ) : items.length === 0 ? (
            <div className="text-center py-4 text-zinc-400 dark:text-zinc-500">Nenhum item adicionado ainda</div>
          ) : (
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
                  <Checkbox
                    checked={item.is_completed}
                    onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${item.is_completed ? "line-through text-zinc-400 dark:text-zinc-500" : "text-zinc-800 dark:text-zinc-100"}`}>
                      {item.title}
                    </p>
                  </div>
                  <Badge variant="secondary" className="text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 border-none">
                    {formatTime(item.estimated_time)}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
