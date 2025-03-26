interface Ingredient {
    _id: string;
    name: string;
    category: string;
};
  
interface Recipe {
    _id: string | null;
    name: string;
    cuisine?: string;
    difficulty?: string;
    cook_mins?: string;
    clean_mins?: string;
    ingredients: Ingredient[];
    recipeImage?: string;
    imgCredit?: string;
    imgCreditUrl?: string;
};
  
type tempFormIngredient = {
    _id?: string;
    name: string;
    category: string;
};

type tempRecipeForm = {
    _id: string | null;
    recipeName: string;
    cuisine: string;
    difficulty: string;
    cook_mins: string;
    clean_mins: string;
    ingredients: tempFormIngredient[];
    recipeImage: string;
    imgCredit: string;
    imgCreditUrl: string;
  };


////// home view components

function RecipeApp() {

    //state to store recipe list
    const [recipes, setRecipes] = React.useState<Recipe[]>([]);
    // state to control whether add new recipe modal is shown
    const [newRecipe, setNewRecipe] = React.useState<boolean>(false);


    React.useEffect(() => {
      //use API to fetch recipes
        fetch('/api/recipes')
            .then(response => response.json())
            .then(data => setRecipes(data));

    }, []);

    return(
        <div>
            {/* render recipe list and pass callbacks to handle updates/deletes/etc. */}
            <RecipeList 
                recipes={recipes} 
                onUpdateRecipe={(updatedRecipe) => {
                    setRecipes(prev =>
                                                        // condition ? true: false
                        prev.map(recipe => recipe._id === updatedRecipe._id ? updatedRecipe : recipe)
                    );
                }}
                onDeleteRecipe={(deletedId) => {
                    setRecipes(prev => prev.filter(recipe => recipe._id !== deletedId));
                }}
            />

            {/* change state onclick to trigger modal */}
            <button id="addnew" onClick={() => setNewRecipe(true)}>Add New Recipe</button>

            {/* show modal if state is true */}
            {newRecipe && (
                <EditRecipeEntry
                    selectedRecipe={{
                        _id: null,
                        name: "",
                        cuisine: "",
                        difficulty: "",
                        cook_mins: "",
                        clean_mins: "",
                        ingredients: [],
                        recipeImage: "",
                        imgCredit: "",
                        imgCreditUrl: ""
                    }}
                    onClose={() => setNewRecipe(false)}
                    onSave={(addedRecipe) => {
                        setRecipes(prev => [...prev, addedRecipe]);
                        setNewRecipe(false);
                    }}
                    // indicate method for handleSubmit of edit/add form
                    isPOST={true}
                />
            )}
        </div>
    );
}

//component for recipe list
function RecipeList({recipes, onUpdateRecipe, onDeleteRecipe}: {
    recipes: Recipe[];
    onUpdateRecipe: (updated: Recipe) => void;
    onDeleteRecipe: (id: string) => void;
}) {
    return(
        <div className="recipeList">
            <ul>
                {/* render each recipe name as row */}
                {recipes.map(recipe => (
                <RecipeRow 
                    key={recipe._id || recipe.name} 
                    recipe={recipe} 
                    onUpdateRecipe={onUpdateRecipe}
                    onDeleteRecipe={onDeleteRecipe}
                />
                ))}
            </ul>
        </div>
    );
}

//component for each recipe item
function RecipeRow({ recipe, onUpdateRecipe, onDeleteRecipe }: {
    recipe:Recipe;
    onUpdateRecipe: (updated: Recipe) => void;
    onDeleteRecipe: (id: string) => void;
}) {

    // toggle detail view
    const [isActive, setIsActive] = React.useState(false);

    return (
        <li>
            {/* button to toggle detail view */}
            <button id="recipes" type="button" onClick={() => {
                setIsActive(prev => !prev);
            }}>
                <h2>{recipe.name} - {recipe.cuisine}</h2>
            </button>
        
            {/* show detail view if active */}
            {isActive && (
                <SingleRecipeEntry
                    selectedRecipe={recipe}
                    onUpdateRecipe={onUpdateRecipe}
                    onDeleteRecipe={onDeleteRecipe}
                />
            )}
      </li>
    );
}

////// detail view components

//component for recipe entry
function SingleRecipeEntry({selectedRecipe, onUpdateRecipe, onDeleteRecipe}: {
    selectedRecipe: Recipe;
    onUpdateRecipe: (updated: Recipe) => void;
    onDeleteRecipe: (id: string) => void;
}
) {

    // default is not editing
    const[isEditing, setIsEditing] = React.useState(false);
    const[currentRecipe, setCurrentRecipe] = React.useState(selectedRecipe);

    // update local state if recipe updated after save
    React.useEffect(() => {
        setCurrentRecipe(selectedRecipe);
    }, [selectedRecipe]);

    const { cuisine, difficulty, cook_mins, clean_mins, ingredients } = currentRecipe;

    // group ingredients by category
    const groupedIngredObject: { [category: string]: string[] } = {};
    ingredients.forEach((ingredient) => {
      if (!groupedIngredObject[ingredient.category]) {
        groupedIngredObject[ingredient.category] = [];
      }
      groupedIngredObject[ingredient.category].push(ingredient.name);
    });

    // delete logic from database and local state
    const handleDelete = (e) => {
        fetch(`/api/recipes/${currentRecipe._id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then(() => {
                alert("Recipe deleted.");
                if(currentRecipe._id) {
                    onDeleteRecipe(currentRecipe._id); //update state
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };

    return (
        <div className="detail">
            <RecipeFigure selectedRecipe={currentRecipe} />

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
                                    <li key={ingredient}>{ingredient}</li>
                                ))}
                            </ul>
                        </div>
                        // close ingredientGroup
                    ))}
                </div>
                {/* close ingredientGrid */}

                {/* open modal */}
                <button id ="edit" type="button" onClick={() => setIsEditing(true)}>Edit Recipe</button>
                <input
                    id="delete"
                    type="button"
                    value="Delete Recipe"
                    onClick={handleDelete}
                />
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

// modal component for adding/editing recipe
function EditRecipeEntry({selectedRecipe, onClose, onSave, isPOST=false}: {
    selectedRecipe: Recipe;
    onClose: () => void;
    onSave: (updated: Recipe) => void;
    isPOST?: boolean;
}) {
    const categoryOptions = ["Protein", "Produce", "Pantry", "Condiments & Oils", "Seasonings & Spices"]

    //form state with defaults
    const [formData, setFormData] = React.useState<tempRecipeForm>({
        _id: selectedRecipe._id,
        recipeName: selectedRecipe.name || "",
        cuisine: selectedRecipe.cuisine || "",
        difficulty: selectedRecipe.difficulty || "",
        cook_mins: selectedRecipe.cook_mins || "",
        clean_mins: selectedRecipe.clean_mins || "",
        ingredients: selectedRecipe.ingredients || [],
        recipeImage: selectedRecipe.recipeImage || "",
        imgCredit: selectedRecipe.imgCredit || "",
        imgCreditUrl: selectedRecipe.imgCreditUrl || ""
    });

    // to reference for adding ingredients to recipe
    const [allIngredients, setAllIngredients] = React.useState<Ingredient[]>([]);
    const [newIngredient, setNewIngredient] = React.useState<{ name: string; category: string }>({
        name: "",
        category: categoryOptions[0],
    });

    // reduce clutter in jsx - update form fields 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    // handle updates
    const updateIngredient = (index: number, field: keyof tempFormIngredient, value: string) => {
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
            recipeName: "",
            cuisine: "",
            difficulty: "",
            cook_mins: "",
            clean_mins: "",
            ingredients: [],
            recipeImage: "",
            imgCredit: "",
            imgCreditUrl: ""
        });
    };

    // updated handleSubmit to save to db and switch methods for create/update
    const handleSubmit = (e) => {
        e.preventDefault(); 

        const switchAPI = isPOST ? '/api/recipes': `/api/recipes/${formData._id}`;
        const switchMethod = isPOST ? 'POST' : 'PUT';

        fetch(switchAPI, {
            method: switchMethod,
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name: formData.recipeName,
                cuisine: formData.cuisine,
                difficulty: formData.difficulty,
                cook_mins: formData.cook_mins,
                clean_mins: formData.clean_mins,
                ingredients: formData.ingredients.map(ingredient => ({
                    _id: ingredient._id,
                    name: ingredient.name,
                    category: ingredient.category
                })),
                recipeImage: formData.recipeImage,
                imgCredit: formData.imgCredit,
                imgCreditUrl: formData.imgCreditUrl
            })
        })
        .then(res => res.json())
        .then(updatedRecipe => {
            onSave(updatedRecipe);
            onClose();
        })
        .catch(error => {
            console.log(error);
        });
          
    };

    // fetch existing ingredients to check if item exists before adding new one
    React.useEffect(() => {
        fetch('/api/ingredients')
            .then(res => res.json())
            .then(data => setAllIngredients(data))
            .catch(error => console.log("error fetching ingredients:", error));
    }, []);

    const isExistingIngredient = allIngredients.find(
        (ingredient) =>
            ingredient.name.toLowerCase() === newIngredient.name.toLowerCase()
    );
      
    const isInRecipe = formData.ingredients.some(
        (ingredient) =>
            ingredient.name.toLowerCase() === newIngredient.name.toLowerCase()
    );
    

    return(
        <div className="modal-wrapper">
            <div className="modal">
                <button type="button" className="close" onClick={onClose}>X</button>

                <h2 id="form">Edit {formData.recipeName}</h2>

                <form 
                    onSubmit={handleSubmit}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            e.preventDefault(); // prevents enter from submitting the form
                        }
                        }}
                >
                <div className="recipeInfoRow">
                    <label>
                        Recipe name:
                            <input 
                                name="recipeName"
                                value={formData.recipeName}
                                onChange={handleChange}
                            />
                    </label>
                </div>
                <label>
                    Image Link:
                        <input 
                            name="recipeImage"
                            value={formData.recipeImage}
                            onChange={handleChange}
                        />
                </label>
                <label>
                    Caption for image credit:
                        <input 
                            name="imgCredit"
                            value={formData.imgCredit}
                            onChange={handleChange}
                        />
                </label>
                <div className="recipeInfoRow">
                    <label>
                        Link to source page:
                            <input 
                                name="imgCreditUrl"
                                value={formData.imgCreditUrl}
                                onChange={handleChange}
                            />
                    </label>
                </div>
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
                <p><i>Update the name and/or category of an existing ingredient, or add new ingredient to the recipe.</i></p>
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

                        {/* remove ingredient from sccprojects.recipes ingredient array*/}
                        {/* this does NOT remove ingredient from sccprojects.ingredients */}
                        {/* // this prevents shared ingredients being deleted from other recipes */}
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
                    {/* check if ingredient exists in sccprojects.ingredients before adding to sccprojects.recipes */}
                    <div className="ingredient-edit-row">
                        <input
                            type="text"
                            list="ingredient-names"
                            placeholder="New ingredient name"
                            value={newIngredient.name}
                            onChange={(e) => {
                                // define the inputted new ingredient name
                                const inputtedIngredient = e.target.value;
                                // find the existing ingredient which matches the inputted name
                                const matchedIngredient = allIngredients.find(
                                    (ingredient) => ingredient.name.toLowerCase() === inputtedIngredient.toLowerCase()
                                );

                                if (matchedIngredient) {
                                    setNewIngredient({name: matchedIngredient.name, category: matchedIngredient.category,});
                                } else {
                                    setNewIngredient((prev) => ({
                                        ...prev, name: inputtedIngredient, category: categoryOptions[0],
                                    }));
                                }
                            }}
                        />
                        <select
                            value={newIngredient.category}
                            disabled={!!isExistingIngredient}
                            onChange={(e) =>
                                setNewIngredient((prev) => ({
                                    ...prev,
                                    category: e.target.value,
                                }))
                            }
                        >
                        {categoryOptions.map((option, i) => (
                            <option key={i} value={option}>
                                {option}
                            </option>
                        ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => {
                                if (newIngredient.name.trim() === "") return;

                                if (isInRecipe) {
                                    alert("This ingredient is already in the recipe.");
                                    return;
                                }

                                setFormData((prev) => ({
                                    ...prev,
                                    ingredients: [
                                        ...prev.ingredients, {
                                            name: newIngredient.name,
                                            category: newIngredient.category,
                                        },
                                    ],
                                }));

                                setNewIngredient({
                                    name: "",
                                    category: categoryOptions[0],
                                });
                            }}
                            >
                            Add
                            </button>


                        </div>

                        <datalist id="ingredient-names">
                        {allIngredients.map((ingredientItem, i) => (
                            <option key={i} value={ingredientItem.name} />
                        ))}
                        </datalist>
                <input id="clear" type="button" value="Clear" onClick={clearForm}/>
                <input id="submit" type="submit" value="Save" />
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


const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(<RecipeApp />);

