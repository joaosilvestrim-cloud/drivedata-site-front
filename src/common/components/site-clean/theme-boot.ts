// Tema do site (claro ou escuro). Sem escolha salva, segue o sistema da pessoa
// (prefers-color-scheme). A escolha feita no botão do trilho fica no cookie e
// vira o atributo data-site-theme no <html>, aplicado por este script ANTES da
// primeira pintura para não piscar. O React não renderiza esse atributo, então
// não há divergência de hidratação.
//
// Cookie e atributo são novos de propósito: o tema antigo (data-theme) tinha o
// escuro como padrão e ainda vale nas páginas que não migraram.

export const SITE_THEME_ATTR = 'data-site-theme';
export const SITE_THEME_COOKIE = 'drive-data-lp:site-theme';

export const siteThemeBootScript = `(function(){try{var m=document.cookie.match(/(?:^|; )drive-data-lp:site-theme=(light|dark)/);if(m){document.documentElement.setAttribute('${SITE_THEME_ATTR}',m[1])}}catch(e){}})()`;
