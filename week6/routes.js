import Recipe from './models/recipe.js'; 
import Ingredient from './models/ingredient.js';

export default (app) => {
    /// routes for views
    //home
    app.get('/', async (req,res) => {
            try {
                const recipes = await Recipe.find(); //get recipes from mongodb
                const selectedRecipe = null;
                if (req.query.name) {
                    selectedRecipe = await Recipe.findOne({ name: req.query.name }).populate({
                    path: 'ingredients',
                    options: { sort: {category: 1, name: 1 }}
                });
                }
            
                res.render('home', { 
                    recipes: JSON.stringify(recipes), selectedRecipe: selectedRecipe ? JSON.stringify(selectedRecipe) : null
                });
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
    }); 

    // about
    app.get('/about', (req, res) => {
        res.render('about');
    });

    //// rest api routes
    // GET all recipes
    app.get('/api/recipes', (req, res) => {
        Recipe.find().populate('ingredients')
            .then((recipes) => { res.json(recipes); })
            .catch(error => { res.status(500).json({error: 'Error getting recipes'}); })
        });

    // GET one recipe
    app.get('/api/recipes/:id', (req, res) => {
        Recipe.findById(req.params.id).populate('ingredients')
            .then((recipe) => {
                if (!recipe) { 
                    return res.status(404).json({error: 'Recipe not found'});
                }
                res.json(recipe);
             })
            .catch(error => { res.status(500).json({error: 'Error getting recipe'}); })
        });

    // DELETE one recipe
    app.delete('/api/recipes', (req, res) => {
        Recipe.deleteOne({name: decodeURIComponent(req.query.name)})
        .then(result => {
            if (!result.deletedCount) {
                return res.status(404).send({error: 'Recipe not found'});
            }
            res.json("Recipe deleted");
        })
        .catch(error => { res.status(500).send({error: 'Error deleting recipe'}); })
    });

    // ADD one recipe 
    app.post('/api/recipes', (req, res) => {
        const { name, cuisine, difficulty, cook_mins, clean_mins, ingredients, recipeImage, imgCredit, imgCreditUrl } = req.body;

        // create placeholder for future ingredient ids
        const promisedIngredient = ingredients.map(({ name: ingredientName, category }) => {
            return Ingredient.findOne({name: ingredientName})
            .then(existingIngredient => {
                if (existingIngredient) {
                    return existingIngredient._id;
                } else {
                    //if not already in db, it must have a name and category
                    return Ingredient.create({name: ingredientName, category })
                    .then(newIngredient => newIngredient._id);
                }
            });
        });

        Promise.all(promisedIngredient)
            .then(ingredientIds => {

                return Recipe.create({
                    name, cuisine, difficulty, cook_mins, clean_mins, ingredients:ingredientIds, recipeImage, imgCredit, imgCreditUrl
                });
            })
        .then(newRecipe => res.status(201).json(newRecipe))
        .catch(error => { res.status(500).send({ error: 'Error adding new recipe'}); });

    });

    // 404 Error Handler
    app.use((req, res) => {
        return res.status(404).json({ error: "Page not found" });
    });


};

