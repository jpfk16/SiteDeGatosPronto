# 🐱 Orfanato dos Gatos

Site para divulgação e gestão de adoção de gatos, com cadastro de animais, página de contato com informações da ONG, e painel administrativo protegido por login com **MongoDB**.

## ✨ Funcionalidades

- Página inicial institucional (banner, chamada para ajudar e seção "Porque precisamos")
- Página de **Adoções** com cards de gatos carregados do banco de dados
- Modal ao clicar no card — foto ampliada, nome e descrição completa
- Página de **Contato** com informações da ONG (Instagram, e-mail, PIX, localização e botão Apoia.se)
- Painel **Admin** protegido por login (usuário + senha criptografada no MongoDB)
- Troca de senha dentro do painel (só quando logado)
- Token JWT com validade de 8 horas — sessão expira automaticamente
- Upload de fotos dos gatos com compressão automática (via **sharp**) e armazenamento **direto no MongoDB** (em base64) — não depende de disco local, então as fotos não se perdem quando o servidor reinicia/dorme (ex: plano gratuito do Render)
- API REST própria com Express + MongoDB

> ℹ️ Existe também uma página `sobre.html` (história, galeria e equipe) no projeto, mas ela não está linkada no menu de navegação atual.

> ℹ️ O backend já tem rota e model prontos para salvar mensagens de contato (`/contato`, com campos nome, telefone, e-mail, CPF, estado, cidade e mensagem), mas a página `contato.html` atual não exibe mais o formulário — só o cartão de informações/redes sociais da ONG. O `js/contato.js` já está preparado pra funcionar assim que um `<form id="form-contato">` for adicionado de volta à página.

## 🛠️ Tecnologias

- **Backend:** Node.js, Express
- **Banco de dados:** MongoDB + Mongoose
- **Autenticação:** JWT (jsonwebtoken) + bcryptjs
- **Upload de imagens:** Multer (armazenamento em memória) + Sharp (compressão/redimensionamento) — imagem final salva como base64 no MongoDB
- **Frontend:** HTML, CSS e JavaScript puro

## 📂 Estrutura do projeto

```
Gatos/
├── config/
│   └── database.js              # Conexão com o MongoDB
├── controllers/
│   ├── authController.js         # Login e troca de senha
│   ├── gatoController.js         # CRUD de gatos (comprime e salva foto em base64)
│   └── contatoController.js      # Formulário de contato
├── middleware/
│   ├── auth.js                   # Verificação do token JWT
│   └── upload.js                 # Recebe a foto em memória (multer.memoryStorage)
├── models/
│   ├── Gato.js                   # Schema do gato (campo "imagem" guarda base64 ou nome do arquivo padrão)
│   ├── Contato.js                # Schema de contato
│   └── Usuario.js                # Schema de admin (senha criptografada)
├── routes/
│   ├── auth.js                   # /auth/login e /auth/trocar-senha
│   ├── gatos.js                  # /gatos (GET público, POST/DELETE protegidos)
│   └── contato.js                # /contato
├── public/                       # Frontend servido pelo Express
│   ├── index.html                # Home
│   ├── sobre.html                # Sobre Nós (não linkado no menu atualmente)
│   ├── adocao.html               # Adoções com modal
│   ├── admin-login.html          # Tela de login do admin
│   ├── admin.html                # Painel admin (protegido)
│   ├── contato.html              # Contato com info da ONG
│   ├── *.css
│   ├── img/                      # Imagens fixas (logo, banners...)
│   └── js/
│       ├── adocao.js             # Carrega gatos e modal de adoção
│       ├── admin.js              # Painel admin com autenticação
│       └── contato.js            # Envio do formulário de contato (aguardando form na página)
├── uploads/                      # Pasta legada — não é mais usada para novas fotos, mantida só por compatibilidade
├── criar-admin.js                # Script para criar o primeiro usuário admin
├── server.js                     # Ponto de entrada
├── package.json
└── .env.example
```

## 🚀 Como rodar localmente

### 1. Pré-requisitos
- [Node.js](https://nodejs.org/) v18 ou superior
- Conta no [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (gratuita) ou MongoDB local

### 2. Instalar dependências
```bash
cd Gatos
npm install
```

### 3. Configurar o `.env`
Renomeie `.env.example` para `.env` e preencha:

```env
PORT=3000
MONGO_URI=mongodb+srv://USUARIO:SENHA@cluster.mongodb.net/gatos
JWT_SECRET=coloque_aqui_uma_frase_longa_e_secreta
```

> **JWT_SECRET** pode ser qualquer texto longo — ele é usado para assinar os tokens de login. Ex: `meu_orfanato_secreto_2024_gatos`

### 4. Criar o primeiro usuário admin
Abra o arquivo `criar-admin.js` e troque o usuário e senha pelo que preferir, depois rode:

```bash
node criar-admin.js
```

Você verá uma confirmação no terminal com o usuário criado.

### 5. Iniciar o servidor
```bash
npm run dev    # desenvolvimento (reinício automático)
npm start      # produção
```

### 6. Acessar
```
http://localhost:3000
```

> ⚠️ Mantenha o terminal aberto enquanto quiser usar o site. Fechar o terminal encerra o servidor.

## 🔐 Sistema de Login

| Página | Caminho | Acesso |
|--------|---------|--------|
| Login admin | `/admin-login.html` | Público |
| Painel admin | `/admin.html` | Somente logado |

- Se tentar acessar `/admin.html` sem estar logado, é redirecionado para o login automaticamente
- O token expira em **8 horas** — após isso é necessário fazer login novamente
- A senha é armazenada criptografada no banco (bcrypt) — ninguém consegue lê-la diretamente
- Para trocar a senha, clique em **🔑 Trocar senha** dentro do painel admin

## 📡 Rotas da API

### Autenticação
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| POST | `/auth/login` | Público | Faz login e retorna o token |
| POST | `/auth/trocar-senha` | 🔒 Logado | Troca a senha do admin |

### Gatos
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/gatos` | Público | Lista todos os gatos |
| POST | `/gatos` | 🔒 Logado | Cadastra um novo gato (foto é comprimida e salva em base64 no MongoDB) |
| DELETE | `/gatos/:id` | 🔒 Logado | Remove um gato |

### Contato
| Método | Rota | Acesso | Descrição |
|--------|------|--------|-----------|
| GET | `/contato` | Público | Lista mensagens recebidas |
| POST | `/contato` | Público | Envia mensagem de contato (rota pronta, aguardando formulário no front-end) |

## 📝 Páginas

| Página | Caminho | Descrição |
|--------|---------|-----------|
| Home | `/` | Página inicial |
| Adoções | `/adocao.html` | Gatos disponíveis para adoção |
| Login Admin | `/admin-login.html` | Tela de login |
| Admin | `/admin.html` | Cadastro e exclusão de gatos |
| Contato | `/contato.html` | Informações e redes sociais da ONG |
| Sobre Nós | `/sobre.html` | História, galeria e equipe (existe mas não está no menu) |

## 🖼️ Imagens

As imagens fixas em `public/img/` (logo, banners, foto padrão de gato) são editáveis diretamente — basta substituir o arquivo mantendo o mesmo nome.

As fotos dos gatos cadastrados pelo admin **não** ficam em `public/img/` nem em `uploads/`: elas são enviadas pelo formulário do painel, comprimidas no servidor (sharp) e guardadas como base64 no próprio documento do gato no MongoDB. Gatos cadastrados sem foto recebem a imagem padrão `gato-padrao.png`.

## 📌 Observações

- O site inteiro (frontend + API) roda numa única aplicação Express na mesma porta
- Fotos novas de gatos são salvas no MongoDB (base64), o que evita perda de imagens em hospedagens com sistema de arquivos temporário (ex: Render free tier, que apaga arquivos locais quando o serviço reinicia ou "dorme" por inatividade)
- A pasta `uploads/` é legada: só serve pra manter compatibilidade com gatos cadastrados antes dessa mudança
- O link **ADMIN** no menu leva para `/admin-login.html` — em produção considere removê-lo do menu público
