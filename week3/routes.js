import Recipe from './models/recipe.js'; 

export default (app) => {
    //home
    app.get('/', async (req,res) => {
            try {
                const recipes = await Recipe.find(); //get recipes from mongodb
                res.render('home', { recipes });
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
    }); 

    // send content of 'home' view
    app.get('/detail', async (req,res) => {
        const recipeName = decodeURIComponent(req.query.name); 
        console.log(req.query.name);
        try {
            const selectedRecipe = await Recipe.findOne({ name: recipeName }).populate('ingredients');

            if (!selectedRecipe) {
                console.log("Recipe not found in database.");
                return res.status(404).render('404', { message: "Recipe not found" });
            }

            const sortedIngredients = {};

            for (const ingredient of selectedRecipe.ingredients) {
    
                if (ingredient.category) {
                    if (!sortedIngredients[ingredient.category]) {
                        sortedIngredients[ingredient.category] = [];
                    }
                    sortedIngredients[ingredient.category].push(ingredient.name);
                } else {
                    console.error(`Ingredient ${ingredient.name} is missing a category`);
                }
            }

            selectedRecipe.sortedIngredients = sortedIngredients;
            res.render('detail', { selectedRecipe, recipeName });
                
        } catch (error) {
            console.error("Error fetching recipe details:", error);
        }
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

