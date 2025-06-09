"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface AddItemDialogProps {
  listId: string
  onItemAdded: () => void
}

export function AddItemDialog({ listId, onItemAdded }: AddItemDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [estimatedTime, setEstimatedTime] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: maxOrderData } = await supabase
        .from("study_items")
        .select("order_index")
        .eq("list_id", listId)
        .order("order_index", { ascending: false })
        .limit(1)

      const nextOrder = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].order_index + 1 : 0

      const { error } = await supabase.from("study_items").insert({
        list_id: listId,
        title,
        estimated_time: Number.parseInt(estimatedTime),
        order_index: nextOrder,
      })

      if (error) throw error

      setTitle("")
      setEstimatedTime("")
      setOpen(false)
      onItemAdded()
    } catch (error) {
      console.error("Error adding item:", error)
      alert("Erro ao adicionar item")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Adicionar Item
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Adicionar Item de Estudo</DialogTitle>
          <DialogDescription>Adicione um novo tópico à sua lista de estudos</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="item-title">Título do Tópico</Label>
              <Input
                id="item-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Equações do 2º grau"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="estimated-time">Tempo Estimado (minutos)</Label>
              <Input
                id="estimated-time"
                type="number"
                value={estimatedTime}
                onChange={(e) => setEstimatedTime(e.target.value)}
                placeholder="Ex: 30"
                min="1"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Adicionar
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
