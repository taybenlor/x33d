import { fillText, playSound } from './helpers';
import { handleRouting } from './menu/routes';
import { isNewUser, getOrCreateUserId } from './menu/storage';
import { loadHomepage } from './menu/home';
import { SeedDisplayElement } from './elements/seed-display';
import { SeedGraphicElement } from './elements/seed-graphic';
import { SeedIdElement } from './elements/seed-id';
import { SeedItemElement } from './elements/seed-item';
import { SeedListElement } from './elements/seed-list';
import { SeedSelectListElement } from './elements/seed-select-list';
import { SeedMachineElement } from './elements/seed-machine';
import { SeedGrowerElement } from './elements/seed-grower';

window.customElements.define('seed-display', SeedDisplayElement);
window.customElements.define('seed-graphic', SeedGraphicElement);
window.customElements.define('seed-id', SeedIdElement);
window.customElements.define('seed-item', SeedItemElement);
window.customElements.define('seed-list', SeedListElement);
window.customElements.define('seed-select-list', SeedSelectListElement);
window.customElements.define('seed-machine', SeedMachineElement);
window.customElements.define('seed-grower', SeedGrowerElement);

const beginEl = document.getElementById('begin');

if (!isNewUser()) {
  beginEl.textContent = 'Continue';
}

beginEl.addEventListener('click', function() {

  document.getElementById('screen-start').setAttribute('hidden', '');
  const audio = document.getElementById('audio');
  audio.volume = 0.3;
  audio.play();

  if (isNewUser()) {
    document.getElementById('screen-home').removeAttribute('hidden');
    // New users should start on the homepage
    loadHomepage();
  } else {
    // Start by handling the routing (they may have loaded on a different page)
    if (!window.location.hash) {
      window.location.hash = '#machine';
    }
    handleRouting();
  }

  // If the hash changes then route the user
  window.addEventListener('hashchange', handleRouting);

  // Fill in the user's name on the page
  fillText('user', getOrCreateUserId());
});
