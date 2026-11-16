# Portal da Cidade — protótipo funcional

## Como abrir

- **Visualização rápida:** abra `portal-visualizacao.html` no navegador (Chrome, Edge ou Firefox). É o portal inteiro em um único arquivo.
- **Projeto completo:** abra `index.html` com todos os arquivos na mesma pasta.

Fora do Claude, o portal entra em **modo local**:
- os dados ficam salvos no `localStorage` deste navegador;
- você entra como **Administrador local**, com acesso ao painel do empresário e à administração;
- o link "restaurar demonstração", na barra superior, apaga os dados locais e volta aos dados de exemplo.

Os itens com o selo **Demonstração** são fictícios.

## Arquivos

| Arquivo | Conteúdo |
|---|---|
| `index.html` | Estrutura da página e inicialização |
| `style.css` | Identidade visual (paleta oficial, Inter + Montserrat, responsivo) |
| `core.js` | Utilitários, estado, acesso a dados, métricas, upload de imagens e componentes |
| `public.js` | Roteador, cabeçalho, home e páginas públicas, além de login e cadastro |
| `panel.js` | Painel do empresário: cadastro em 6 etapas, galeria, produtos, promoções, estatísticas e plano |
| `admin.js` | Administração: aprovações, empresas, usuários, categorias, zonas, conteúdos, planos, anúncios, relatórios e configurações |
| `local-db.js` | Banco local que simula a API do banco real (modo offline) |
| `seed-data.js` | Dados de demonstração (categorias, zonas, planos, empresas, ofertas, eventos etc.) |
| `portal-visualizacao.html` | Todos os arquivos acima em um único HTML |

## Rotas (hash)

`#inicio`, `#empresas`, `#empresa-<slug>`, `#categorias`, `#categoria-<id>`, `#servicos`, `#profissionais`, `#eventos`, `#turismo`, `#ofertas`, `#empregos`, `#noticias`, `#telefones-uteis`, `#bairros`, `#mapa`, `#planos`, `#entrar`, `#cadastro`, `#painel`, `#painel-*`, `#admin`, `#admin-*`.

## Modelo de dados (coleções)

- `config/site | categories | locations | plans`: configurações do portal (só a administração edita).
- `companies/<idUsuário>`: empresas, promoções, eventos e vagas de cada empresário (cada um edita só o próprio documento).
- `moderation/<c_|p_|e_|j_|u_|r_ + id>`: status, aprovação, plano, selos e suspensões (só a administração edita).
- `private/<idUsuário>`: dados pessoais e CPF/CNPJ (visíveis só ao titular e à administração).
- `metrics/<idVisitante>`: visualizações e cliques reais, somados por empresa.
- `reviews/<idUsuário>`: avaliações.
- `events`, `news`, `jobs`, `phones`, `tourism`, `opps`, `ads`, `payments`, `logs`: conteúdos administrativos.

## Para produção (Next.js + Supabase)

Esta estrutura se traduz diretamente em tabelas PostgreSQL com Row Level Security, que reproduzem as regras acima. As peças a trocar são:
- **Login:** Supabase Auth com e-mail e senha, verificação de e-mail e recuperação de senha.
- **Imagens:** Supabase Storage.
- **Mapa:** uma API de mapas real.
- **Pagamentos:** um gateway de pagamento para as assinaturas.
