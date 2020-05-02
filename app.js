
import { Home }         from './pages/Home.js'
import { Add }          from './pages/Add.js'
import { Error404 }     from './pages/Error404.js'

import * as utils from './utils/utils.js'

//Hash-based router
let routes = {
    '#home' : Home,
    '#add' : Add
}

const router = async () => {
    const hash = utils.getHash();
    const contentContainer = document.getElementById("content-container");

    let page = routes[hash] ? routes[hash] : Error404;

    contentContainer.innerHTML = await page.render();
    await page.afterRender(router);
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);
document.getElementById(utils.getHash().substr(1)).addEventListener('click', router); // Necessary?



