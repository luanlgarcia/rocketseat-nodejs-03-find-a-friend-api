# Find A Friend API

API REST para um sistema de adoção de animais. Organizações (ORGs) cadastram pets disponíveis para adoção, e pessoas interessadas buscam animais por cidade, filtrando por características como porte, idade e nível de energia. O contato para adoção acontece diretamente com a ORG responsável pelo pet.

O projeto foi construído com foco em arquitetura limpa, separação de responsabilidades (SOLID) e cobertura de testes em duas camadas: testes unitários para as regras de negócio e testes end-to-end para os fluxos HTTP completos.

## Stack

- **Node.js** com **TypeScript** (ESM)
- **Fastify** como framework HTTP
- **Prisma 7** como ORM, com driver adapter (`@prisma/adapter-pg`)
- **PostgreSQL** como banco de dados
- **Zod** para validação de schemas
- **JWT** (`@fastify/jwt`) e **cookies** (`@fastify/cookie`) para autenticação
- **Vitest** para testes unitários e e2e, com **Supertest**
- **Docker Compose** para o ambiente de banco local
- **GitHub Actions** para CI

## Arquitetura e decisões técnicas

O projeto segue os princípios SOLID, com destaque para a inversão de dependência através de repositórios.

**Repositórios com contrato (interface).** Cada repositório é definido por uma interface, com duas implementações: uma in-memory (usada nos testes unitários) e uma Prisma (usada em produção). Isso torna as duas intercambiáveis e permite testar as regras de negócio sem depender de banco de dados.

**Use cases isolados.** A lógica de negócio vive em casos de uso independentes do framework HTTP. Regras como hash de senha (no cadastro de ORG) e validação de propriedade (um pet sempre pertence a uma ORG) ficam na camada de aplicação, não nos controllers nem nos repositórios.

**Factories para injeção de dependência.** Cada use case tem uma factory que o instancia já com o repositório Prisma, conectando a regra de negócio testável à aplicação real.

**Autenticação por JWT com refresh token.** O login retorna um token de acesso e um refresh token armazenado em cookie httpOnly. As rotas de escrita (cadastro de pet) são protegidas e só acessíveis por uma ORG autenticada. O `org_id` do pet vem do token, nunca do corpo da requisição.

**Testes e2e com schemas isolados.** Cada arquivo de teste e2e roda em um schema PostgreSQL próprio e descartável, criado no setup e removido no teardown. Isso garante que os testes não interferem entre si e rodam sempre contra um banco limpo.

Este foi meu primeiro projeto aplicando inversão de dependência e separação em camadas. No começo parece construção de código a mais, mas ao finalizar entendi que essas camadas tornam o projeto muito mais estruturado e manutenível.

## Funcionalidades

- Cadastro de ORG (com endereço e WhatsApp obrigatórios)
- Login de ORG (autenticação por e-mail e senha)
- Cadastro de pet associado a uma ORG (rota protegida)
- Listagem de pets por cidade (cidade obrigatória)
- Filtros opcionais na listagem (idade, porte, nível de energia, nível de independência, ambiente)
- Visualização dos detalhes de um pet específico

## Regras de negócio

- A cidade é obrigatória para listar pets
- Toda ORG precisa de endereço e número de WhatsApp
- Todo pet precisa estar vinculado a uma ORG
- O contato do interessado em adotar é feito diretamente com a ORG via WhatsApp
- Todos os filtros de características, exceto a cidade, são opcionais
- Para ter acesso administrativo (cadastrar pet), a ORG precisa estar autenticada

## Rotas

| Método | Rota | Autenticação | Descrição |
| --- | --- | --- | --- |
| POST | `/orgs` | Pública | Cadastra uma ORG |
| POST | `/sessions` | Pública | Autentica uma ORG |
| PATCH | `/token/refresh` | Cookie | Renova o token de acesso |
| POST | `/pets` | JWT | Cadastra um pet (ORG logada) |
| GET | `/pets/search` | Pública | Lista pets por cidade, com filtros |
| GET | `/pets/:petId` | Pública | Detalhes de um pet |

## Como rodar

### Pré-requisitos

- Node.js 22+
- Docker e Docker Compose

### Passo a passo

1. Clone o repositório e instale as dependências:

```bash
npm install
```

2. Crie um arquivo `.env` na raiz com base no `.env.example`:

```
DATABASE_URL="postgresql://docker:docker@localhost:5432/findafriend?schema=public"
JWT_SECRET="sua-chave-secreta"
NODE_ENV="dev"
```

3. Suba o banco de dados:

```bash
docker compose up -d
```

4. Rode as migrations:

```bash
npx prisma migrate deploy
```

5. Inicie o servidor em modo de desenvolvimento:

```bash
npm run start:dev
```

## Testes

Os testes unitários cobrem as regras de negócio (use cases) usando repositórios in-memory:

```bash
npm test
```

Os testes e2e cobrem os fluxos HTTP completos, contra um banco PostgreSQL real com schemas isolados por arquivo de teste:

```bash
npm run test:e2e
```

Outros comandos disponíveis:

```bash
npm run test:watch       # unitários em modo watch
npm run test:e2e:watch   # e2e em modo watch
npm run test:coverage    # relatório de cobertura
```

## CI

O projeto roda dois workflows no GitHub Actions: os testes unitários a cada push e os testes e2e a cada pull request. O pipeline de e2e sobe um PostgreSQL como serviço, gera o Prisma Client, aplica as migrations e roda a suíte completa.

## Sobre o projeto

Projeto desenvolvido a partir do desafio Find A Friend, da formação de Node.js da Rocketseat.