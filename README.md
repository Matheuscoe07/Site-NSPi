
# 🤖 Site NSPi

![React](https://img.shields.io/badge/React%20Native-2025-blue)
![Typescript](https://img.shields.io/badge/Expo-managed-lightgrey)
![Node.js](https://img.shields.io/badge/Node.js-backend-green)
![Supabase](https://img.shields.io/badge/MongoDB-database-brightgreen)

## 📌 Visão Geral

Este é um site interativo para o Núcleo de Sistema Produtivo Inteligente (NSPi), desenvolvido com **React** e backend em **Node.js, TypeSript com MongoDB**.  
O projeto faz parte do **Instituto Mauá de Tecnologia**, com o objetivo de trazer a realidade da indústria 4.0 para o ambiente acadêmico.  

🔗 **Protótipo no Figma:** [Acessar Design](https://www.figma.com/design/RwJONMWdySDyC6UnqopMkU/Site-NSPi?node-id=0-1&p=f&t=k5KeLqqB8g0NljZt-0)

---

## 👥 Grupo

| Nome Completo                 |
| :---------------------------- | 
| Eike Gonçalves Barbosa        | 
| Matheus Coelho Pinto          |
| Eduardo De Medeiros Siqueira  | 

---

---

## 🚀 Começando

### ✅ Pré-requisitos

- Node.js **v18+**
- npm **v9+**
- Projeto Supabase configurado (URL + Anon Key)

---

```

---

## ▶️ Executando o projeto

```bash
# TERMINAL 1
npm run dev

```


---


```

---

## 📁 Estrutura do Projeto

```
SITE-NSPI/
├── node_modules/ 
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── lib/
│   ├── criarPedido.ts
│   ├── pages/
│   │   ├── confirmado.css
│   │   ├── confirmado.tsx
│   │   ├── contato.css
│   │   ├── contato.tsx
│   │   ├── home.css
│   │   ├── home.tsx
│   │   ├── login.css
│   │   ├── login.tsx
│   │   ├── pedido.css
│   │   ├── pedido.tsx
│   │   ├── registrar.css
│   │   └── registrar.tsx
│   ├── utils/
│   │   ├── authService.ts
│   │   ├── supabase.ts
│   │   └── validators.ts
│   ├── App.css
│   ├── App.tsx
│   ├── auth.tsx
│   ├── index.css
│   ├── main.tsx
│   ├── ProtectedRoute.tsx
│   └── vite-env.d.ts
├── .env
├── .gitignore
├── eslint.config.js
├── index.html
├── README.md
├── package-lock.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts


