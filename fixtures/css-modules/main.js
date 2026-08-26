import globalCss from '../../src/recipes/index.css?inline';
import local from './panel.module.css';
import './global.css';
document.head.append(Object.assign(document.createElement('style'), { textContent: globalCss }));
document.querySelector('#app').innerHTML = `<section class="${local.panel} _nb-spike-surface" data-_nb-level="outlined"><h1>CSS Modules coexistence</h1><button class="_nb-spike-button" type="button">Global recipe + ${local.button}</button></section>`;
