# delivery-api

API de entregas de encomendas desenvolvida em Node.js com TypeScript, Express e Prisma.

## Funcionalidades

- **Gestão de Usuários:** Cadastro, autenticação e controle de acesso por perfil.
- **Gestão de Entregas:** Criação, listagem, detalhamento e remoção de entregas.
- **Logs de Entrega:** Registro e consulta de logs relacionados às entregas.
- **Autenticação JWT:** Rotas protegidas por autenticação e autorização.
- **Validações:** Uso de Zod para validação de dados.
- **Testes Automatizados:** Cobertura de testes para usuários, sessões, entregas e logs.

## Estrutura de Pastas

```
src/
  controllers/      # Lógica dos endpoints (users, deliveries, sessions, deliveryLogs)
  middlewares/      # Autenticação, autorização, tratamento de erros
  routes/           # Definição das rotas da API
  tests/            # Testes automatizados divididos por domínio
  utils/            # Utilitários e helpers
  database/         # Configuração do banco de dados (Prisma)
  configs/          # Configurações gerais
```

## Principais Bibliotecas

- **express:** Framework web para Node.js
- **prisma:** ORM para banco de dados relacional
- **jsonwebtoken:** Autenticação via JWT
- **bcrypt:** Hash de senhas
- **zod:** Validação de dados
- **jest:** Testes automatizados
- **supertest:** Testes de integração HTTP

## Como rodar o projeto

1. Instale as dependências:
   ```bash
   npm install
   ```
2. Configure o banco de dados e variáveis de ambiente (veja `.env-example`).
3. Rode as migrations do Prisma:
   ```bash
   npx prisma migrate dev
   ```
4. Inicie o servidor em modo desenvolvimento:
   ```bash
   npm run dev
   ```

## Como rodar os testes

```bash
npm test
```

ou

```bash
npm run test:dev
```

## Testes implementados

- **Usuários:** Cadastro, autenticação, validação de dados e permissões.
- **Sessões:** Login, geração de token e fluxos de autenticação.
- **Entregas:** Criação, listagem, detalhamento e remoção de entregas.
- **Logs de Entrega:** Registro e consulta de logs relacionados às entregas.

---
