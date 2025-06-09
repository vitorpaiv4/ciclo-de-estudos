"use client"

import type React from "react"
import { useUser } from "@clerk/nextjs"
import { useToast } from "@/components/ui/use-toast"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

interface CreateListDialogProps {
  onListCreated: () => void
}

export function CreateListDialog({ onListCreated }: CreateListDialogProps) {
  const { user } = useUser()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [cycleDuration, setCycleDuration] = useState("7")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (!user) throw new Error("Usuário não autenticado")
      const { error } = await supabase.from("study_lists").insert({
        user_id: user.id,
        title,
        description: description || null,
        cycle_duration: Number.parseInt(cycleDuration),
      })

      if (error) throw error

      setTitle("")
      setDescription("")
      setCycleDuration("7")
      setOpen(false)
      onListCreated()
      toast({
        title: "Lista criada com sucesso!",
        description: `A lista '${title}' foi criada.`,
        variant: "default",
      })
    } catch (error: any) {
      console.error("Error creating list:", error)
      toast({
        title: "Erro ao criar lista",
        description: error.message || "Ocorreu um erro ao criar a lista.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Lista
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-xs sm:max-w-md p-4 sm:p-8">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-2xl">Criar Nova Lista de Estudos</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">Configure sua nova lista de estudos por ciclos</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-2 sm:py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Matemática Básica"
                required
                className="text-base sm:text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Descreva o conteúdo desta lista..."
                rows={3}
                className="text-base sm:text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duração do Ciclo</Label>
              <Select value={cycleDuration} onValueChange={setCycleDuration}>
                <SelectTrigger className="text-base sm:text-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 dia</SelectItem>
                  <SelectItem value="3">3 dias</SelectItem>
                  <SelectItem value="7">1 semana</SelectItem>
                  <SelectItem value="14">2 semanas</SelectItem>
                  <SelectItem value="30">1 mês</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Criar Lista
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
