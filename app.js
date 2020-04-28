
import { Home } from './pages/Home.js'
import { Add } from './pages/Add.js'

//Router
const router = async () => {
    const hash = window.location.hash;
    const pageContainer = document.getElementById("page_container");

    if (!(pageContainer instanceof HTMLElement)) {
        throw new ReferenceError("No router view element available for rendering");
    }

    switch (hash) {
        case "#home":
            pageContainer.innerHTML = await Home.render();
            await Home.afterRender(router);
            //utils.showModal('This is a test');
            break;

        case "#addProduct":
            pageContainer.innerHTML = await Add.render();
            await Add.afterRender(router);
            break;

        default:
            pageContainer.innerHTML = "<h1>404 - Page not found</h1>";
            break;
    }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', router);

