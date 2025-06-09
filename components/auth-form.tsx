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
import { useTheme } from "next-themes"
import { supabase } from "@/lib/supabase"

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [resetEmail, setResetEmail] = useState("")
  const [resetSent, setResetSent] = useState(false)
  const [resetError, setResetError] = useState("")
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const { theme, setTheme } = useTheme()
  const [tab, setTab] = useState("signin")

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
    setLoading(true)
    setError("")
    try {
      await signInWithGoogle()
      // Feedback de sucesso pode ser um toast ou mensagem, mas aqui só limpamos o erro
    } catch (err: any) {
      setError(err.message || "Erro ao fazer login com Google")
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError("")
    setResetSent(false)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
      })
      if (error) throw error
      setResetSent(true)
    } catch (err: any) {
      setResetError(err.message || "Erro ao enviar email de recuperação")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black dark:bg-black transition-colors duration-300 px-4">
      <Card className="w-full max-w-md bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg shadow-2xl border border-zinc-200 dark:border-zinc-800 p-0">
        <CardHeader className="text-center flex flex-col items-center gap-2 pb-2">
          <div className="bg-zinc-900 dark:bg-zinc-800 p-2 mb-2 shadow-lg">
            <Sparkles className="h-8 w-8 text-white drop-shadow" />
          </div>
          <CardTitle className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight leading-tight">FocusFlow</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400 font-medium text-base">Acesse sua conta para organizar seus estudos</CardDescription>
        </CardHeader>
        <CardContent className="pt-2 pb-6 px-0">
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <TabsTrigger value="signin" className="text-zinc-700 dark:text-zinc-200 font-semibold tracking-wide data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white transition-colors">Entrar</TabsTrigger>
              <TabsTrigger value="signup" className="text-zinc-700 dark:text-zinc-200 font-semibold tracking-wide data-[state=active]:bg-zinc-200 dark:data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white transition-colors">Cadastrar</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <div className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-zinc-800 dark:text-zinc-200">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-zinc-800 dark:text-zinc-200">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500 dark:text-red-400 font-medium">{error}</p>}
                  <Button type="submit" className="w-full bg-zinc-900 dark:bg-zinc-800 text-white font-bold shadow-lg hover:scale-[1.02] hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-200 py-2 text-base border-none rounded-none" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Entrar
                  </Button>
                </form>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-zinc-500 dark:text-zinc-400 hover:underline focus:outline-none"
                    onClick={() => setTab("reset")}
                  >
                    Esqueci minha senha?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/80 dark:bg-zinc-950/80 px-2 text-zinc-400 dark:text-zinc-500">Ou continue com</span>
                  </div>
                </div>
                <Button variant="outline" type="button" onClick={handleGoogleSignIn} className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 py-2 text-base border-none rounded-none">
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
                    <Label htmlFor="signup-email" className="text-zinc-800 dark:text-zinc-200">Email</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-zinc-800 dark:text-zinc-200">Senha</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                  {error && <p className="text-sm text-red-500 dark:text-red-400 font-medium">{error}</p>}
                  <Button type="submit" className="w-full bg-zinc-900 dark:bg-zinc-800 text-white font-bold shadow-lg hover:scale-[1.02] hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-200 py-2 text-base border-none rounded-none" disabled={loading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Cadastrar
                  </Button>
                </form>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-zinc-500 dark:text-zinc-400 hover:underline focus:outline-none"
                    onClick={() => setTab("reset")}
                  >
                    Esqueci minha senha?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/80 dark:bg-zinc-950/80 px-2 text-zinc-400 dark:text-zinc-500">Ou continue com</span>
                  </div>
                </div>
                <Button variant="outline" type="button" onClick={handleGoogleSignIn} className="w-full border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 py-2 text-base border-none rounded-none">
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
            <TabsContent value="reset">
              <div className="space-y-4">
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email" className="text-zinc-800 dark:text-zinc-200">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      className="bg-zinc-100 dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-500"
                    />
                  </div>
                  {resetError && <p className="text-sm text-red-500 dark:text-red-400 font-medium">{resetError}</p>}
                  {resetSent && <p className="text-sm text-green-600 dark:text-green-400 font-medium">Email de recuperação enviado!</p>}
                  <Button type="submit" className="w-full bg-zinc-900 dark:bg-zinc-800 text-white font-bold shadow-lg hover:scale-[1.02] hover:bg-zinc-800 dark:hover:bg-zinc-700 transition-all duration-200 py-2 text-base border-none rounded-none">
                    Enviar recuperação
                  </Button>
                </form>
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-xs text-zinc-500 dark:text-zinc-400 hover:underline focus:outline-none"
                    onClick={() => setTab("signin")}
                  >
                    Voltar para login
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      <button
        aria-label="Alternar tema"
        className="fixed top-4 right-4 z-50 p-2 bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-200 shadow hover:bg-zinc-300 dark:hover:bg-zinc-700 transition-colors border border-zinc-300 dark:border-zinc-700 rounded-none"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71m16.97 0l-.71-.71M4.05 4.93l-.71-.71M21 12h-1M4 12H3m9 5a5 5 0 100-10 5 5 0 000 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        ) : (
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </button>
    </div>
  )
}
