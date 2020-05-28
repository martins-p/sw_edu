/* eslint-disable linebreak-style */
import { Home } from './pages/Home.js';
import { Add } from './pages/Add.js';
import { Error404 } from './pages/Error404.js';

import * as utils from './utils/utils.js';

//  Hash-based router
const routes = {
  '#home': Home,
  '#add': Add,
};

const router = async () => {
  const hash = utils.getHash();
  const contentContainer = document.getElementById('content-container');

  const page = routes[hash] ? routes[hash] : Error404;

  contentContainer.innerHTML = page.preRender();
  contentContainer.innerHTML = await page.render();
  await page.afterRender();
};

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
