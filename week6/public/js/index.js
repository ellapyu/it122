
////// home view components

function RecipeApp() {
    const [recipes, setRecipes] = React.useState([]);

    React.useEffect(() => {
      //use API to fetch recipes
        fetch('/api/recipes')
            .then(response => response.json())
            .then(data => setRecipes(data));

    }, []);

    return(
        <div>
            {/* final rendering of all components w/ callback to update edited details */}
            <RecipeList 
                recipes={recipes} 
                onUpdateRecipe={(updatedRecipe) => {
                    setRecipes(prev =>
                        prev.map(recipe => recipe._id === updatedRecipe._id ? updatedRecipe : recipe)
                    );
                }} 
            />
        </div>
    );
}

//component for recipe list
function RecipeList({recipes, onUpdateRecipe}) {
    return(
        <div className="recipeList">
            <ul>
                {/* render each recipe name as row */}
                {recipes.map(recipe => (
                <RecipeRow 
                    recipe={recipe} 
                    key={recipe._id} 
                    onUpdateRecipe={onUpdateRecipe} 
                />
                ))}
            </ul>
        </div>
    );
}

//component for each recipe item
function RecipeRow({ recipe, onUpdateRecipe }) {

    // default is not active, then active when editing
    const [isActive, setIsActive] = React.useState(false);
    // recipes with details
    const [selectedRecipe, setSelectedRecipe] = React.useState(null);

    React.useEffect(() => {
        if (isActive && !selectedRecipe) {
            //use API to get a recipe's details
            fetch(`/api/recipes/${recipe._id}`)
            .then(response => response.json())
            .then(data => setSelectedRecipe(data));
        }
    }, [isActive, selectedRecipe, recipe._id]);

    return (
        <li>
            {/* toggle detail view */}
            <button id="recipes" type="button" onClick={() => {
                setIsActive(prev => !prev);
                if (!isActive && !selectedRecipe) {
                    fetch(`/api/recipes/${recipe._id}`)
                        .then(res => res.json())
                        .then(data => setSelectedRecipe(data));
                }
            }}>
                <h2>{recipe.name} - {recipe.cuisine}</h2>
            </button>
        
            {/* render detail view if active */}
            {isActive && selectedRecipe && (
                <SingleRecipeEntry
                    selectedRecipe={selectedRecipe}
                    onUpdateRecipe={onUpdateRecipe}
                />
            )}
      </li>
    );
}

////// detail view components

//component for recipe entry
function SingleRecipeEntry({selectedRecipe, onUpdateRecipe}) {

    // default is not editing
    const[isEditing, setIsEditing] = React.useState(false);
    const[currentRecipe, setCurrentRecipe] = React.useState(selectedRecipe);

    const { name, cuisine, difficulty, cook_mins, clean_mins, ingredients } = currentRecipe;

    // group ingredients by category
    const groupedIngredObject = {}
    ingredients.forEach((ingredient => {
        if (!groupedIngredObject[ingredient.category]) {
            groupedIngredObject[ingredient.category] = [];
        }
        groupedIngredObject[ingredient.category].push(ingredient.name);
    }))


    return (
        <div className="detail">
            <RecipeFigure selectedRecipe={selectedRecipe} />

            <div className="recipeInfo">
                <div className="recipeInfoRow">
                    <span><strong>Cuisine:</strong> {cuisine}</span>
                    <span><strong>Difficulty:</strong> {difficulty}</span>
                </div>
                <div className="recipeInfoRow">
                    <span><strong>Cook time:</strong> {cook_mins} minutes</span>
                    <span><strong>Clean up time:</strong> {clean_mins} minutes</span>
                </div>
                {/* close recipeInfoRow */}

                <h3>Ingredients</h3>
                <div className="ingredientGrid">
                    {Object.entries(groupedIngredObject).map(([category, items]) => (
                        <div className="ingredientGroup" key={category}>
                            <h4>{category}</h4>
                            <ul className="ingredientCategories">
                                {items.map((ingredient, index) => (
                                    <li key={index}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                        // close ingredientGroup
                    ))}
                </div>
                {/* close ingredientGrid */}

                {/* open modal */}
                <button id ="edit" type="button" onClick={() => setIsEditing(true)}>Edit Recipe</button>
            </div>
            {/* close recipeInfo */}

            {/* show form component if state is true */}
            {isEditing && (
                <EditRecipeEntry
                    selectedRecipe={currentRecipe}
                    onClose={() => setIsEditing(false)}
                    onSave={(updatedData) => {
                        setCurrentRecipe(updatedData);
                        setIsEditing(false);
                        onUpdateRecipe(updatedData);
                    }}
                />
            )}
        </div>
        // close detail
    );
}

function EditRecipeEntry({selectedRecipe, onClose, onSave}) {
    const categoryOptions = ["Protein", "Produce", "Pantry", "Condiments & Oils", "Seasonings & Spices"]

    const [formData, setFormData] = React.useState({
        name: selectedRecipe.name,
        cuisine: selectedRecipe.cuisine || "",
        difficulty: selectedRecipe.difficulty || "",
        cook_mins: selectedRecipe.cook_mins || "",
        clean_mins: selectedRecipe.clean_mins || "",
        ingredients: selectedRecipe.ingredients || [],
    });

    // reduce clutter in jsx
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // handle updates
    const updateIngredient = (index, field, value) => {
        const updatedIngredients = [...formData.ingredients];
        updatedIngredients[index] = {
            ...updatedIngredients[index],
            [field]: value,
        };
        setFormData((prevState) => ({
            ...prevState,
            ingredients: updatedIngredients,
        }));
      };

    const clearForm = () => {
        setFormData({
            ...formData,
            cuisine: "",
            difficulty: "",
            cook_mins: "",
            clean_mins: "",
            ingredients: [],
        });
    };

    const handleSubmit = (e) => {
        // save to state on submit
        e.preventDefault(); 
        onSave(formData);
        onClose();
          
    };

    return(
        <div className="modal-wrapper">
            <div className="modal">
                <button type="button" className="close" onClick={onClose}>X</button>

                <h2 id="form">Edit {formData.name}</h2>

                <form 
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault(); // prevents enter from submitting the form
                        }
                        }}
                >
                <label>
                    Cuisine:
                        <input 
                            name="cuisine"
                            value={formData.cuisine}
                            onChange={handleChange}
                        />
                </label>
                <label>
                    Difficulty:
                        <input 
                            name="difficulty"
                            value={formData.difficulty}
                            onChange={handleChange}
                        />
                </label>
                <label>
                    Cook time:
                        <input 
                            name="cook_mins"
                            value={formData.cook_mins}
                            onChange={handleChange}
                        />
                </label>
                <label>
                    Clean time:
                        <input 
                            name="clean_mins"
                            value={formData.clean_mins}
                            onChange={handleChange}
                        />
                </label>

                <h3>Ingredients</h3>
                {formData.ingredients.map((ingredient, index) =>
                    <div key={index} className="ingredient-edit-row">
                        <input
                            type="text"
                            value={ingredient.name}
                            onChange={(e) => 
                                updateIngredient(index, "name", e.target.value)
                            }
                        />
                        {/* dropdown for categories */}
                        <select
                            value={ingredient.category}
                            onChange={(e) => 
                                updateIngredient(index, "category", e.target.value)
                            }
                        >

                        {categoryOptions.map((option, i) => (
                            <option key={i} value={option}>
                            {option}
                            </option>
                        ))}
                        </select>

                        {/* remove ingredient */}
                        <button type="button" onClick={() => {
                            const updatedIngredients = [...formData.ingredients];
                            updatedIngredients.splice(index, 1);
                            setFormData((prev) => ({
                                ...prev,
                                ingredients: updatedIngredients,
                            }));
                        }}
                        >X</button>
                    </div>)}

                    {/* add ingredient row */}
                    <button
                        type="button"
                        onClick={() =>
                            setFormData((prev) => ({
                                ...prev,
                                ingredients: [
                                    ...prev.ingredients,
                                    { name: "", category: categoryOptions[0] },
                                ],
                            }))
                        }
                    >
                    + Add Ingredient
                    </button>
                <input id="clear" type="button" value="Clear" onClick={clearForm}/>
                <input id="submit" type="submit" value="Submit" />
                </form>
            </div>
        </div>
    )
}

function RecipeFigure({selectedRecipe}) {
    return(
        <figure>
            <img src={selectedRecipe.recipeImage} alt={selectedRecipe.name} />
            
            {selectedRecipe.imgCredit && (
                <RecipeImgCredit imgCredit={selectedRecipe.imgCredit} imgCreditUrl={selectedRecipe.imgCreditUrl} /> 
            )}
        </figure>
    );
}

function RecipeImgCredit({imgCredit, imgCreditUrl}) {
    return(
            <figcaption>Image source:
                <a href={imgCreditUrl} target="_blank"> {imgCredit}</a>
            </figcaption>
    );
}

function RecipeDetails({}) {

}

ReactDOM.render(<RecipeApp />, document.getElementById("root"));
