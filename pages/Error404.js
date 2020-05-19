let Error404 = {

    preRender : () => {},
    render : 
    
    /*  async () => {
        
        fetch('error.html',  {mode: 'no-cors'} )
        .then(response => response.text())
        .then(data=> console.log(data))
        
       
    }  */
    
     async () => {
        let view =  
        `<section class="section">
            <h1>404 - Page not found</h1>
        </section>`;
        return view;
    } 
    ,
    afterRender: () => {}
}
export {Error404};