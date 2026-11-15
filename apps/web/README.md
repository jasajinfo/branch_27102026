# Curso ADS — Plataforma de cursos (React + Vite)

Projeto acadêmico demonstrativo de uma página de catálogo de cursos, com pesquisa em tempo real, filtros, visualização de aulas em modal e layout responsivo.

## Requisitos

- Node.js compatível com o Vite 8 (versão 20.19+ ou 22.12+; ou uma versão posterior suportada)
- npm

## Executar no VS Code

Abra **a pasta `curso-ads`**, que contém o arquivo `package.json`. No terminal dessa pasta:

```powershell
npm install
npm run dev
```

Abra a URL informada pelo Vite no terminal, normalmente `http://localhost:5173/`.

Para testar a compilação de produção:

```powershell
npm run build
```

Para verificar regras de lint:

```powershell
npm run lint
```

## Onde editar o visual

| Arquivo | Responsabilidade |
|---|---|
| `src/index.css` | Reset de estilos, configurações globais e imports |
| `src/styles/tokens.css` | Cores, fontes, espaçamentos e variáveis de tema |
| `src/styles/layout.css` | Container, botões e componentes visuais compartilhados |
| `src/App.css` | Seção de cursos, filtros e grade de cards |
| `src/components/Header.css` | Menu e cabeçalho responsivo |
| `src/components/Banner.css` | Banner principal e campo de busca |
| `src/components/CourseCard.css` | Cartões dos cursos |
| `src/components/Footer.css` | Rodapé |
| `src/components/VideoPlayer.css` | Janela/modal do vídeo |

Cada componente React (`.jsx`) importa seu próprio CSS com `import "./Nome.css";`.

## Funcionamento

- A busca filtra por título, categoria ou professor.
- O botão de pesquisa leva à seção de cursos.
- Os chips de assuntos sugeridos preenchem a pesquisa.
- Os filtros funcionam sem recarregar a página.
- O botão **Ver aula** abre um vídeo em modal; `Esc` fecha o modal.
- O menu mobile abre/fecha em telas pequenas.

## Imagens e vídeos

- A imagem principal está em `public/imagens/banner.png` e faz parte do projeto original.
- As imagens dos cards estão definidas por links externos em `src/data/courses.js` e dependem de acesso à internet.
- Os vídeos são incorporados do YouTube usando o `videoId` de cada curso. A reprodução depende de o vídeo ainda estar disponível e permitir incorporação.
- Os cursos, os nomes dos instrutores e os preços são dados ilustrativos.

## Alterações desta versão

- CSS organizado por componente, substituindo o CSS do template Vite;
- identidade visual moderna com tons de violeta e azul-escuro;
- layout responsivo para desktop e celular;
- cabeçalho com menu para dispositivos móveis;
- cards com tipografia, hierarquia visual e botões padronizados;
- modal de vídeo com URL de incorporação corrigida;
- metadados de idioma, título e descrição da página.
