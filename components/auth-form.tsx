"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth"
import { Loader2 } from "lucide-react"
import { Sparkles } from "lucide-react"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signIn, signUp, signInWithGoogle } = useAuth()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signIn(email, password)
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login")
    } finally {
      setLoading(false)
    }
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await signUp(email, password)
    } catch (err: any) {
      setError(err.message || "Erro ao criar conta")
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login com Google")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e293b] via-[#6366f1] to-[#a21caf] px-4 animate-fade-in">
      <Card className="w-full max-w-md bg-white/10 backdrop-blur-lg shadow-xl border-0">
        <CardHeader className="text-center flex flex-col items-center gap-2">
          <div className="bg-gradient-to-tr from-[#6366f1] to-[#a21caf] rounded-full p-2 mb-2 animate-bounce-slow">
            <Sparkles className="h-8 w-8 text-white drop-shadow" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-white tracking-tight">FocusFlow</CardTitle>
          <CardDescription className="text-white/70 font-medium">Acesse sua conta para organizar seus estudos</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-white/10 border border-white/20">
              <TabsTrigger value="signin" className="text-white data-[state=active]:bg-gradient-to-tr data-[state=active]:from-[#6366f1] data-[state=active]:to-[#a21caf] data-[state=active]:text-white">Entrar</TabsTrigger>
              <TabsTrigger value="signup" className="text-white data-[state=active]:bg-gradient-to-tr data-[state=active]:from-[#6366f1] data-[state=active]:to-[#a21caf] data-[state=active]:text-white">Cadastrar</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <div className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-white/20 border-white/20 text-white placeholder:text-white/60" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
                  <Button type="submit" className="w-full bg-gradient-to-tr from-[#6366f1] to-[#a21caf] text-white font-bold shadow-lg hover:scale-[1.03] transition-transform duration-200" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
                  </Button>
                </form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/10 px-2 text-white/60">Ou continue com</span>
                  </div>
                </div>
                <Button variant="outline" type="button" onClick={handleGoogleSignIn} className="w-full border-white/20 text-white hover:bg-white/10">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Entrar com Google
                </Button>
              </div>
            </TabsContent>
            <TabsContent value="signup">
              <div className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-white">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-white">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-white/20 border-white/20 text-white placeholder:text-white/60"
                    />
                  </div>
                  {error && <p className="text-sm text-red-400 font-medium">{error}</p>}
                  <Button type="submit" className="w-full bg-gradient-to-tr from-[#6366f1] to-[#a21caf] text-white font-bold shadow-lg hover:scale-[1.03] transition-transform duration-200" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Cadastrar
                  </Button>
                </form>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/20" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/10 px-2 text-white/60">Ou continue com</span>
                  </div>
                </div>
                <Button variant="outline" type="button" onClick={handleGoogleSignIn} className="w-full border-white/20 text-white hover:bg-white/10">
                  <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  Cadastrar com Google
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 1.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-bounce-slow {
          animation: bounceSlow 2.2s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes bounceSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
      `}</style>
    </div>
  )
}
