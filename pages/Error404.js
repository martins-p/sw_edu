let Error404 = {

    render : async () => {
        let view =  `
            <section class="section">
                <h1>404 - Page not found</h1>
            </section>
        `
        return view
    }
    , afterRender: async () => {
        
    }
}
export {Error404};