<h1 align="center">Nexa Finance</h1>

<h3 align="center">Sistema Fullstack de Gestão Financeira Inteligente</h3>

<p align="center">
<a href="#art-sobre-o-projeto">Sobre o Projeto</a> |
<a href="#computer-tecnologias-usadas">Tecnologias Usadas</a> |
<a href="#package-como-rodar-o-projeto-localmente">Como Rodar</a>
</p>

# :art: Sobre o Projeto

O Nexa Finance é uma aplicação Fullstack desenvolvida para oferecer controle total sobre a vida financeira do usuário. Através de uma interface moderna e responsiva, é possível registrar receitas, despesas, criar categorias personalizadas e gerar relatórios de forma ágil.

O projeto foi construído utilizando uma arquitetura profissional de **Monorepo (Yarn Workspaces)**, garantindo a centralização das dependências, facilidade de manutenção e a padronização rigorosa de código entre a Interface e a API utilizando o Biome.

## ✨ Features Principais

  * **Gestão de Transações:** Registro detalhado de entradas e saídas, incluindo valores, datas e descrições.
  * **Categorias Personalizadas:** Sistema híbrido que combina categorias globais padrão do sistema com categorias customizadas pelo usuário (com seletor nativo de cores HEX).
  * **Filtros e Paginação sob Demanda:** Busca por texto, filtros precisos de mês/ano e paginação (*Offset Pagination*) executados diretamente no banco de dados para máxima performance.
  * **Exportação Avançada de Relatórios:** Geração nativa e download de arquivos `.csv` perfeitamente formatados para análise no Excel, construído com JavaScript puro (Web APIs) sem depender de bibliotecas pesadas.
  * **Arquitetura de Alta Performance:** API construída com Fastify para roteamento ultrarrápido e Prisma ORM para queries otimizadas no banco de dados.

# :computer: Tecnologias Usadas

### Front-end (Interface)

  * **React + Vite** (Biblioteca de UI e Bundler ultrarrápido)
  * **Tailwind CSS** (Estilização utilitária avançada)
  * **Lucide React** (Biblioteca de ícones SVG)
  * **React Router** (Navegação dinâmica de rotas)
  * **React Toastify** (Feedbacks visuais e alertas)
  * **Web APIs (Blob & URL)** (Geração de arquivos e downloads nativos)

### Back-end (API)

  * **Node.js & Fastify** (Servidor e rotamento de alta performance)
  * **Prisma ORM** (Modelagem e manipulação do banco de dados)
  * **MongoDB** (Banco de dados NoSQL)
  * **TypeScript** (Tipagem estática e segurança de código)
  * **Day.js** (Manipulação e formatação de datas)

### Ferramentas Globais

  * **Yarn Workspaces** (Gerenciamento de arquitetura Monorepo)
  * **Biome** (Linter, Formatter e organização de código de ponta a ponta)
  * **TSX** (Execução de arquivos TypeScript)

# :package: Como Rodar o Projeto Localmente

Este projeto utiliza a arquitetura de Monorepo. Siga os passos abaixo para rodar a aplicação em sua máquina de forma integrada.

1.  **Clone o repositório:**

```sh
git clone https://github.com/SeuUsuario/nexa-finance.git
cd nexa-finance
```

2.  **Instale as Dependências Globais:**
    Estando na pasta raiz do projeto, rode o comando abaixo. O Yarn Workspaces se encarregará de instalar as dependências da API e da Interface simultaneamente:

```sh
yarn install
```

3.  **Configure o Banco de Dados e as Variáveis de Ambiente:**

  * Certifique-se de ter um cluster do **MongoDB** rodando (Atlas ou local).
  * Crie os arquivos `.env` nas pastas da API e da Interface conforme o bloco de [Configuração de Variáveis](https://www.google.com/search?q=%23-configura%C3%A7%C3%A3o-de-vari%C3%A1veis-env) abaixo.
  * Na pasta da API, gere as tipagens do banco de dados rodando: `yarn prisma generate`

4.  **Rodando a API (Back-end):**
    Abra um terminal, acesse a pasta da API e inicie o servidor Fastify:

```sh
cd nexa-finance-api
yarn dev
```

5.  **Rodando a Interface (Front-end):**
    Abra um novo terminal, acesse a pasta da Interface e inicie a aplicação Vite:

```sh
cd nexa-finance-interface
yarn dev
```

## 📦 Configuração de Variáveis (.env)

Você precisará criar dois arquivos `.env` separados (um em cada subpasta do monorepo) contendo as seguintes chaves:

**Dentro da pasta `nexa-finance-api` (.env):**

```env
DATABASE_URL="sua_connection_string_do_mongodb_aqui"
PORT=3333
# Adicione outras variáveis de autenticação ou chaves secretas (ex: JWT_SECRET) caso aplicável.
```

**Dentro da pasta `nexa-finance-interface` (.env):**

```env
VITE_API_URL="http://localhost:3333"
# Adicione outras variáveis de ambiente necessárias para o front-end.
```

# :bug: Problemas

Sinta-se à vontade para abrir uma *Issue* caso encontre bugs ou tenha sugestões de melhoria para o projeto!

<p align="center"> Feito com 💜 pelo <strong>Grupo 10</strong> sob tutoria do Me. Prof. Victor Hugo Braguim Canto.
