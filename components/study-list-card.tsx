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
}

export function StudyListCard({ list, onListDeleted }: StudyListCardProps) {
  const [items, setItems] = useState<StudyItem[]>([])
  const [cycles, setCycles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

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
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{list.title}</CardTitle>
              {cycles.length > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Trophy className="h-3 w-3" />
                  {cycles.length} ciclo{cycles.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            {list.description && <CardDescription>{list.description}</CardDescription>}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={deleteList}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDuration(list.cycle_duration)}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {formatTime(totalTime)}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progresso</span>
            <span>
              {completedItems}/{totalItems}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Itens de Estudo</h4>
          <AddItemDialog listId={list.id} onItemAdded={loadItems} />
        </div>

        {loading ? (
          <div className="text-center py-4 text-muted-foreground">Carregando...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-4 text-muted-foreground">Nenhum item adicionado ainda</div>
        ) : (
          <div className="space-y-2">
            {items.map((item) => (
              <div key={item.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                <Checkbox
                  checked={item.is_completed}
                  onCheckedChange={(checked) => toggleItem(item.id, checked as boolean)}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${item.is_completed ? "line-through text-muted-foreground" : ""}`}>
                    {item.title}
                  </p>
                </div>
                <Badge variant="secondary" className="text-xs">
                  {formatTime(item.estimated_time)}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
