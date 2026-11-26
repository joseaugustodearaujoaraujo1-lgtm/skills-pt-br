// Layout raiz (Next.js App Router, JavaScript). Fontes locais (public/fonts/fonts.css) e tokens do brief (app/tokens.css).
import './tokens.css';
import './globals.css';

export const metadata = {
  title: '{{NOME}} — {{TEMA}}',
  description: '{{DESCRICAO}}',
};
export const viewport = { themeColor: '{{COR_FUNDO}}' };

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" data-entrada="{{ENTRADA}}">
      <head>
        <link rel="stylesheet" href="/fonts/fonts.css" />
{{PRELOAD_FONTES_JSX}}
      </head>
      <body>{children}</body>
    </html>
  );
}
