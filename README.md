# GitHub Explorer

Solução para o Desafio Front-End Desbravador Software: aplicação **client-side** em **React** com **rotas** (React Router), layout **responsivo com Bootstrap 5** e consumo da [GitHub REST API v3](https://docs.github.com/en/rest) via **Axios**.

**Requisitos de negócio atendidos:**

- Busca de usuário do GitHub
- Detalhes do perfil: avatar, bio, e-mail, seguidores e seguindo
- Listagem de repositórios ordenada por estrelas (decrescente) por padrão, com opção de alterar a ordenação
- Página de detalhes do repositório (nome, descrição, estrelas, linguagem e link externo), acessível pela listagem

**APIs consumidas:**

- `GET https://api.github.com/users/{username}`
- `GET https://api.github.com/users/{username}/repos`
- `GET https://api.github.com/repos/{full_name}`

**Critérios de avaliação:** o projeto prioriza organização de pastas e documentação, uso de TypeScript e React 19, coerência com os requisitos acima, boas práticas (validação, tratamento de erros, token opcional fora do código) e otimização (cache de requisições, fetch paralelo, ordenação com `useMemo`).

## Como rodar

**Pré-requisitos:** [Node.js](https://nodejs.org/) 18+ e npm.

```bash
git clone https://github.com/GuiOrlandin/desafio_desbravador_software.git
cd desafio_desbravador_software
npm install
npm run dev
```

Acesse `http://localhost:5173`.

## Por que TanStack Query (React Query)

O gerenciamento de dados assíncronos da API do GitHub usa **TanStack Query** em vez de `useEffect` manual porque:

- **Cache e stale-while-revalidate** — ao voltar para um perfil já visitado, os dados são reutilizados por até 5 minutos, reduzindo chamadas à API e risco de rate limit
- **Deduplicação** — requisições simultâneas para o mesmo usuário não disparam fetch duplicado
- **Cancelamento automático** — ao trocar de usuário ou página de repositórios, requisições obsoletas são descartadas
- **Estados integrados** — loading, erro e retry ficam declarativos, sem boilerplate de flags locais
- **Sincronização entre queries** — a listagem de repositórios só é buscada após o perfil carregar com sucesso (`enabled`)

O Axios permanece como cliente HTTP em `src/service/`; o React Query cuida apenas do ciclo de vida e cache das requisições.
