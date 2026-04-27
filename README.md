# Gerenciador de tarefas (Next.js 15 + tRPC)

Aplicação de demonstração: CRUD de tarefas em memória, API via **tRPC**, interface em **Next.js 15** (App Router) com **SSR** na listagem e **infinite scroll** para carregar mais itens no cliente.

## Requisitos

- Node.js 20+ (recomendado)
- npm

## Como executar

```bash
cd task-manager
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

- **Lista** (`/`): primeira página de tarefas renderizada no servidor; rolagem carrega mais blocos.
- **Nova tarefa** (`/tarefas/nova`): formulário com validação de título no cliente e no servidor.
- **Editar** (`/tarefas/[id]/editar`): mesma tarefa carregada no servidor a partir do armazenamento em memória.

Build de produção:

```bash
npm run build
npm start
```

## Decisões principais

1. **tRPC + `superjson`**: tipagem ponta a ponta e suporte a `Date` na serialização.
2. **`appRouter.createCaller` no servidor**: a página inicial usa a mesma lógica do endpoint `task.list`, sem HTTP extra, cumprindo o SSR pedido.
3. **Armazenamento em `src/server/db/tasks.ts`**: um array no processo Node; reiniciar o servidor zera os dados (esperado para o desafio).
4. **Infinite scroll**: `task.list` aceita `limit` e `cursor` (id do último item da página anterior); o cliente usa `useInfiniteQuery` e `IntersectionObserver`.
5. **Erros**: validação com Zod nas mutations; `TRPCError` com mensagens claras para atualizar/excluir tarefa inexistente.

## Entrega em repositório público

Não inclua credenciais, tokens ou dados pessoais reais. Este projeto não usa variáveis de ambiente secretas.
