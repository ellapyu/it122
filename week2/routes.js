import { getAll, getItem } from './data.js';

export default (app) => {
    //home
    app.get('/', (req,res) => {
            const recipes = getAll();
            res.render('home', { recipes });
    })

    // send content of 'home' view
    app.get('/detail', (req,res) => {
        const recipeName = decodeURIComponent(req.query.name); 
        const selectedRecipe = getItem(recipeName); 
        console.log(req.query.name);
        if (!selectedRecipe) {
            return res.status(404).render('404', { message: "Recipe not found" });
        }

        res.render('detail', { selectedRecipe, recipeName })
    });

    // about
    app.get('/about', (req, res) => {
        res.render('about');
    });

    // 404 Error Handler
    app.use((req, res) => {
        res.status(404).render('404', { message: "Page not found" });
    });

};

