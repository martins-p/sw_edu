
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

    contentContainer.innerHTML = page.preRender();
    contentContainer.innerHTML = await page.render();
    page.afterRender();
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

/* window.addEventListener('load', ()=>{
    document.getElementById(utils.getHash().substr(1)).addEventListener('click', router)
});
window.addEventListener('hashchange', ()=>{
    document.getElementById(utils.getHash().substr(1)).addEventListener('click', router)
}) */// Necessary?
