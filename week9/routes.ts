import { Express, Request, Response, NextFunction } from "express";

import Recipe from './models/recipe.js'; 
import Ingredient from './models/ingredient.js';

export default (app: Express) => {
    /// routes for views
    //home
    app.get('/', async (req: Request, res: Response) => {
            try {
                const recipes = await Recipe.find(); //get recipes from mongodb
                let selectedRecipe: string | null = null;
                //if recipe queried, populate details
                //ingredients sorted by category using compass
                if (req.query.name) {
                    const selectedRecipeDoc = await Recipe.findOne({ name: req.query.name }).populate({
                    path: 'ingredients',
                    options: { sort: {category: 1, name: 1 }}
                });

                if (selectedRecipeDoc) {
                    selectedRecipe = JSON.stringify(selectedRecipeDoc);
                }
                }
            
                res.render('home', { 
                    recipes: JSON.stringify(recipes),
                    selectedRecipe,
                });
            } catch (error) {
                console.error("Error fetching recipes:", error);
            }
    }); 

    // about
    app.get('/about', (req: Request, res: Response) => {
        res.render('about');
    });

    //// rest api routes
    // GET all recipes
    app.get('/api/recipes', (req: Request, res: Response) => {
        // populate ingredients to simplify components
        // ensures display of all data on submit
        Recipe.find().populate('ingredients')
            .then((recipes) => { res.json(recipes); })
            .catch(error => { res.status(500).json({error: 'Error getting recipes'}); })
        });

    // GET all ingredients
    app.get('/api/ingredients', (req: Request, res: Response) => {
        Ingredient.find()
            .then((ingredients) => { res.json(ingredients); })
            .catch(error => { res.status(500).json({error: 'Error getting ingredients'}); })
        });

    // GET one recipe by id
    app.get('/api/recipes/:id', (req: Request, res: Response) => {
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
    app.delete('/api/recipes/:id', (req: Request, res: Response) => {
        Recipe.findByIdAndDelete(req.params.id)
        .then(result => {
            if (!result) {
                return res.status(404).send({error: 'Recipe not found'});
            }
            res.json("Recipe deleted");
        })
        .catch(error => { res.status(500).send({error: 'Error deleting recipe'}); })
    });

    // helper function to find ingredient ids or create if nonexistent
    function getOrCreateIngredientIds(ingredients) {
        return Promise.all(
            ingredients.map((ingredient) => {
                if (ingredient._id) {
                    // update existing ingredient name/category
                    return Ingredient.findByIdAndUpdate(
                        ingredient._id,
                        { name: ingredient.name, category: ingredient.category },
                        { new: true }
                      ).then(updated => {
                        if (updated) return updated._id});
                    } else {
                        // check for existing ingredient by name/category
                        return Ingredient.findOne({
                            name: { $regex: new RegExp(`^${ingredient.name}$`, "i") },
                            category: ingredient.category
                        }).then(existing => {
                            if (existing) return existing._id;
                            //create ingredient if nonexistent
                            return Ingredient.create ({
                                name: ingredient.name,
                                category: ingredient.category
                        }).then(newIngredient => newIngredient._id);
                    });
                }
            })
        );
    }
              
    // UPDATE one recipe
    app.put('/api/recipes/:id', (req: Request, res: Response) => {
        const { name, cuisine, difficulty, cook_mins, clean_mins, ingredients, recipeImage, imgCredit, imgCreditUrl } = req.body;
        
        // find ingredient ids or create if nonexistent
        getOrCreateIngredientIds(ingredients)
        .then(ingredientIds => {
            return Recipe.findByIdAndUpdate(
                req.params.id, { name, cuisine, difficulty, cook_mins, clean_mins, ingredients:ingredientIds, recipeImage, imgCredit, imgCreditUrl },
                {new:true}); // return document after updates
            })
            .then((UpdatedRecipe) => {
                if (!UpdatedRecipe) {
                    res.status(404).send({error: 'Trouble updating recipe. Updated recipe not found.'})
                    return null;
                }

                return Recipe.findById(UpdatedRecipe._id).populate('ingredients');
            })
            .then(populatedRecipe => res.json(populatedRecipe))
            .catch(error => { res.status(500).send({error: 'Error updating recipe'})})

        });


    // ADD one recipe 
    app.post('/api/recipes', (req: Request, res: Response) => {
        const { name, cuisine, difficulty, cook_mins, clean_mins, ingredients, recipeImage, imgCredit, imgCreditUrl } = req.body;

        // resolve or create ingredient ids
        getOrCreateIngredientIds(ingredients)
        .then(ingredientIds => {
            return Recipe.create({
                name,
                cuisine,
                difficulty,
                cook_mins,
                clean_mins,
                ingredients: ingredientIds,
                recipeImage,
                imgCredit,
                imgCreditUrl
            });
        })
        // pass ingredients to frontend
        .then(newRecipe => 
            Recipe.findById(newRecipe._id).populate('ingredients')
        )
        .then(populatedRecipe => res.status(201).send(populatedRecipe))
        .catch(error => { res.status(500).send({ error: 'Error adding new recipe'}); });

    });

    // 404 Error Handler
    app.use((req: Request, res: Response, next: NextFunction) => {
        res.status(404).send({ error: "Page not found" });
    });


};

