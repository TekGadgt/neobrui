import { flattenTokens, validateTokens } from './schema.mjs';

export const themes = {
  'personal-light': {
    color: { canvas:'#f7f3ea', surface:'#fffdf8', surfaceRaised:'#ffffff', text:'#171512', textMuted:'#625d55', onAction:'#fffdf8', border:'#171512', shadow:'#171512', action:'#8f2d2d', focus:'#245f87', positive:'#286044', negative:'#9a3028' },
    border: { control:'2px solid var(--_nb-color-border)', region:'3px solid var(--_nb-color-border)' }, radius: { control:'0.15rem' },
    shadow: { inline:'3px 0 0 var(--_nb-color-shadow)', block:'0 4px 0 var(--_nb-color-shadow)', pressInline:'1px 0 0 var(--_nb-color-shadow)', pressBlock:'0 1px 0 var(--_nb-color-shadow)' },
    space: {1:'0.25rem',2:'0.5rem',3:'0.75rem',4:'1rem',5:'1.5rem',6:'2rem'}, control:{padInline:'0.8rem',padBlock:'0.55rem'}, region:{gap:'1rem'},
    font:{body:'system-ui, sans-serif',display:'system-ui, sans-serif',mono:'ui-monospace, monospace'}, text:{body:'1rem',label:'0.8rem',heading:'clamp(1.6rem, 4vw, 3rem)'}, motion:{pressDuration:'120ms'}, focus:{width:'3px',offset:'3px'},
    surface:{background:'var(--_nb-color-surface)',border:'var(--_nb-color-border)',shadow:'none'}, button:{background:'var(--_nb-color-action)'}, field:{background:'var(--_nb-color-surface)'}
  },
  'personal-dark': {
    color: { canvas:'#1d2024', surface:'#262b31', surfaceRaised:'#303740', text:'#f4f0e8', textMuted:'#b3b7b9', onAction:'#fff', border:'#f4f0e8', shadow:'#090a0b', action:'#d66a5b', focus:'#82c7ef', positive:'#8fd19f', negative:'#f28b82' },
    border: { control:'2px solid var(--_nb-color-border)', region:'3px solid var(--_nb-color-border)' }, radius:{control:'0.15rem'}, shadow:{inline:'3px 0 0 var(--_nb-color-shadow)',block:'0 4px 0 var(--_nb-color-shadow)',pressInline:'1px 0 0 var(--_nb-color-shadow)',pressBlock:'0 1px 0 var(--_nb-color-shadow)'},
    space:{1:'0.25rem',2:'0.5rem',3:'0.75rem',4:'1rem',5:'1.5rem',6:'2rem'},control:{padInline:'0.8rem',padBlock:'0.55rem'},region:{gap:'1rem'},font:{body:'system-ui, sans-serif',display:'system-ui, sans-serif',mono:'ui-monospace, monospace'},text:{body:'1rem',label:'0.8rem',heading:'clamp(1.6rem, 4vw, 3rem)'},motion:{pressDuration:'120ms'},focus:{width:'3px',offset:'3px'},surface:{background:'var(--_nb-color-surface)',border:'var(--_nb-color-border)',shadow:'none'},button:{background:'var(--_nb-color-action)'},field:{background:'var(--_nb-color-surface)'}
  },
  workshop: {
    color:{canvas:'#f2eadc',surface:'#fffdf5',surfaceRaised:'#fffdf5',text:'#211d19',textMuted:'#665e54',onAction:'#211d19',border:'#211d19',shadow:'#211d19',action:'#d5a900',focus:'#ad3d75',positive:'#397246',negative:'#a13c32'},
    border:{control:'2px solid var(--_nb-color-border)',region:'3px solid var(--_nb-color-border)'},radius:{control:'0'},shadow:{inline:'3px 0 0 var(--_nb-color-shadow)',block:'0 5px 0 var(--_nb-color-shadow)',pressInline:'1px 0 0 var(--_nb-color-shadow)',pressBlock:'0 1px 0 var(--_nb-color-shadow)'},space:{1:'0.25rem',2:'0.5rem',3:'0.75rem',4:'1rem',5:'1.5rem',6:'2rem'},control:{padInline:'0.8rem',padBlock:'0.55rem'},region:{gap:'1rem'},font:{body:'system-ui, sans-serif',display:'system-ui, sans-serif',mono:'ui-monospace, monospace'},text:{body:'1rem',label:'0.8rem',heading:'clamp(1.6rem, 4vw, 3rem)'},motion:{pressDuration:'120ms'},focus:{width:'3px',offset:'3px'},surface:{background:'var(--_nb-color-surface)',border:'var(--_nb-color-border)',shadow:'none'},button:{background:'var(--_nb-color-action)'},field:{background:'var(--_nb-color-surface)'}
  }
};

export function generateCss(themeMap = themes) {
  return Object.entries(themeMap).map(([name, tokens]) => {
    const errors = validateTokens(tokens);
    if (errors.length) throw new Error(`${name}: ${errors.join('; ')}`);
    const lines = flattenTokens(tokens).map(([key,value]) => `  --_nb-${key.replace('.', '-')} : ${value};`.replace(' :', ':'));
    return `[data-_nb-theme="${name}"] {\n${lines.join('\n')}\n}`;
  }).join('\n\n') + '\n';
}
