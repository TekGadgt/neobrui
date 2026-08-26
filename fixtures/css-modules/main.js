import globalCss from '../../src/blocks/index.css?inline';
import local from './panel.module.css';
import './global.css';
document.head.append(Object.assign(document.createElement('style'), { textContent: globalCss }));
document.querySelector('#app').innerHTML = `<section class="${local.panel} nbr-surface" data-nbr-level="outlined"><h1>CSS Modules coexistence</h1><button class="nbr-button" type="button">Global block + ${local.button}</button></section>`;
