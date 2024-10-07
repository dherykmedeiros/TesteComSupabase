
# Gestão de Relatórios

Este é um sistema básico de gestão de relatórios que permite a criação, aprovação e visualização de relatórios, com três tipos de usuários: administrador, fiscal e cliente. A aplicação utiliza Supabase para armazenamento de dados e Tailwind CSS para estilização.

## Funcionalidades

### 1. Login
- **Admin**: Possui acesso ao painel administrativo, onde pode criar novos usuários e aprovar relatórios pendentes.
- **Fiscal**: Pode criar relatórios, que serão submetidos para aprovação do administrador.
- **Cliente**: Pode visualizar relatórios aprovados e confirmar sua visualização.

### 2. Painéis de Usuário
- **Administrador**:
  - Criação de novos usuários (fiscal ou cliente).
  - Aprovação de relatórios pendentes.
  
- **Fiscal**:
  - Criação de relatórios que serão revisados pelo administrador.

- **Cliente**:
  - Visualização de relatórios aprovados.
  - Confirmação da visualização de relatórios (o botão desaparece após a confirmação).

### 3. Estilização
A interface do usuário é estilizada com Tailwind CSS para manter o design simples e responsivo.

## Tecnologias Usadas
- **Frontend**: HTML, Tailwind CSS, JavaScript.
- **Backend**: Supabase (como banco de dados).
- **Bibliotecas**:
  - [Supabase JS](https://github.com/supabase/supabase-js) para interações com o banco de dados.
  - [Tailwind CSS](https://tailwindcss.com/) para estilização.

## Como Executar

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/sistema-de-relatorios.git
   ```

2. Abra o arquivo `index.html` no navegador.

3. **Login**:
   - Use as credenciais padrão do administrador: 
     - **Usuário**: `admin`
     - **Senha**: `admin`

4. **Supabase**:
   - Configure sua própria chave e URL do Supabase no arquivo `app.js`:
     ```javascript
     const supabaseUrl = 'https://seu-projeto.supabase.co';
     const supabaseKey = 'sua-chave';
     ```

## Melhorias Futuras
- Autenticação JWT para maior segurança.
- Adicionar paginação e filtros aos relatórios.
- Sistema de notificações em tempo real para clientes quando novos relatórios forem aprovados.

## Autor
Desenvolvido por [Seu Nome].

