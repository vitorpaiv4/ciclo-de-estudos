import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Database, Key } from "lucide-react"

export function ConfigNotice() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Configuração Necessária</CardTitle>
          <CardDescription>Para usar o sistema de Ciclos de Estudo, você precisa configurar o Supabase</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Passos para Configuração:</h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-white text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="font-medium">Crie um projeto no Supabase</p>
                  <p className="text-sm text-muted-foreground">
                    Acesse{" "}
                    <a
                      href="https://supabase.com"
                      className="text-blue-600 hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      supabase.com
                    </a>{" "}
                    e crie um novo projeto
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-600 text-white text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="font-medium">Execute o script SQL</p>
                  <p className="text-sm text-muted-foreground">
                    Execute o script <code className="bg-gray-100 px-1 rounded">001-create-tables.sql</code> no SQL
                    Editor do Supabase
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg">
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-purple-600 text-white text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="font-medium">Configure as variáveis de ambiente</p>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>Adicione estas variáveis ao seu projeto:</p>
                    <div className="bg-gray-100 p-2 rounded font-mono text-xs">
                      <div className="flex items-center gap-2">
                        <Database className="h-3 w-3" />
                        NEXT_PUBLIC_SUPABASE_URL=sua-url-aqui
                      </div>
                      <div className="flex items-center gap-2">
                        <Key className="h-3 w-3" />
                        NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-aqui
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Recursos do Sistema:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Autenticação segura com login/cadastro</li>
              <li>• Criação de múltiplas listas de estudo</li>
              <li>• Sistema de ciclos que se reinicia automaticamente</li>
              <li>• Controle de tempo por tópico</li>
              <li>• Dados salvos na nuvem</li>
              <li>• Design responsivo e minimalista</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
