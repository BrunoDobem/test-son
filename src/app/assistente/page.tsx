"use client";

import { useState } from "react";
import { Bot, Send, Shield, Sparkles } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { Header } from "@/components/layout/Header";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { savedBotQueries } from "@/lib/mock-data";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function AssistentePage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Olá! Sou o assistente de consulta da Fan Data Platform. Posso responder perguntas sobre a base de fãs, campanhas e métricas. PII é mascarada automaticamente nas respostas.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const ask = (pergunta: string) => {
    setMessages((prev) => [...prev, { role: "user", content: pergunta }]);
    setLoading(true);

    setTimeout(() => {
      const match = savedBotQueries.find((q) => q.pergunta === pergunta);
      const resposta = match
        ? match.resposta
        : "Consulta processada em modo read-only. Para esta demonstração, utilize uma das perguntas sugeridas ou reformule com termos como 'base', 'CPL', 'campanhas' ou 'segmentos'.";

      setMessages((prev) => [...prev, { role: "assistant", content: resposta }]);
      setLoading(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const q = input.trim();
    setInput("");
    ask(q);
  };

  return (
    <AppShell>
      <Header
        title="Assistente IA"
        subtitle="Consulta em linguagem natural — text-to-SQL com guardrails (Fase 2)"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge variant="blue">
          <Shield className="mr-1 inline h-3 w-3" />
          Read-only
        </Badge>
        <Badge variant="neutral">PII mascarada</Badge>
        <Badge variant="neutral">Allow-list de queries</Badge>
        <Badge variant="neutral">Limite 1.000 linhas</Badge>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="card-surface flex h-[500px] flex-col overflow-hidden">
            <div className="flex-1 space-y-4 overflow-y-auto p-6">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}
                >
                  {msg.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-brand shadow-sm">
                      <Bot className="h-4 w-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-brand-purple/10 text-gray-900"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {msg.content.split("**").map((part, j) =>
                      j % 2 === 1 ? (
                        <strong key={j} className="font-semibold text-gray-900">
                          {part}
                        </strong>
                      ) : (
                        <span key={j}>{part}</span>
                      )
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-brand">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-500">
                    Consultando base...
                  </div>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="border-t border-gray-100 p-4">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pergunte sobre a base de fãs, campanhas, CPL..."
                  className="input-field flex-1 px-4 py-2.5 text-sm"
                />
                <Button type="submit" variant="gradient" disabled={loading} className="px-4 py-2.5">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        <div className="card-surface p-6">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-brand-purple" />
            <h3 className="text-sm font-semibold text-gray-900">Perguntas Sugeridas</h3>
          </div>
          <div className="space-y-2">
            {savedBotQueries.map((q) => (
              <button
                key={q.pergunta}
                onClick={() => ask(q.pergunta)}
                disabled={loading}
                className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2.5 text-left text-xs text-gray-600 transition-all duration-150 hover:border-brand-blue/30 hover:bg-blue-50/50 hover:text-gray-900 disabled:opacity-50"
              >
                {q.pergunta}
              </button>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
