# Fan Data Platform — Sony Music + Som Livre

Protótipo visual para apresentação do desafio de CRM D2C (Fan Engagement).

## O que é

Demonstração interativa da **Plataforma de Dados Unificada & CRM D2C** descrita no plano estratégico — um CDP leve (Fan Data Platform) com dados mockados.

### Módulos incluídos

| Módulo | Descrição |
|--------|-----------|
| **Dashboard Executivo** | Base total, evolução histórica, distribuição por label/status, top artistas |
| **Dashboard Operacional** | Leads diários, CPL por plataforma, scoring, gêneros, fontes |
| **Base de Fãs** | Golden record read-only com mascaramento LGPD de PII |
| **Campanhas & CPL** | Performance por campanha, pagos vs orgânicos |
| **Segmentação** | Regras versionadas (editáveis) |
| **Scoring** | Regras configuráveis com sliders interativos |
| **Ingestão** | Status das 7 fontes de dados do pipeline |
| **Assistente IA** | Bot de consulta com perguntas sugeridas (mock Fase 2) |

## Como rodar

```bash
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

## Stack

- Next.js 16 + TypeScript
- Tailwind CSS
- Recharts
- Lucide Icons

## Nota

Todos os dados são **mockados** para fins de demonstração. Nenhuma integração real com Salesforce, Meta, TikTok ou outras fontes.
