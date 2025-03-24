import Recipe from './models/recipe.js'; 
import Ingredient from './models/ingredient.js'; 
import { recipes, ingredients_DB } from './data.js'

const addData = async() => {
    try {
        //probably not the best practice here once the app evolves
        await Ingredient.deleteMany({});
        await Recipe.deleteMany({});

        //add ingredients according to category
        const ingredientMap = {};
        //loop through each category in the ingredient dataset
        for (const category in ingredients_DB) {
            //loop through each ingredient in the given category
            for (const ingredient of ingredients_DB[category]) {
                //create new ingredient doc in the mongoDB database
                const newIngredient = await Ingredient.create({ name: ingredient, category});
                //store each ingredient by ObjectId in the map
                ingredientMap[ingredient] = newIngredient._id;
            }
        }

        //add recipes 
        const recipeMap = recipes.map(recipe => ({
            //convert ingredient names to ObjectIds
            ...recipe,
            ingredients: recipe.ingredients.map(ing => ingredientMap[ing])
        }));

        //insert recipes into mongoDB database
        await Recipe.insertMany(recipeMap);
        console.log("Data inserted.")
    } catch (error) {
        console.error("Error inserting data:", error);
    }

};
export default addData;