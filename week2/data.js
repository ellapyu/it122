const ingredients_DB = {
    protein: [
        "firm silken tofu", "chicken thigh", "ground pork", "canned chicken", "whole mackerel"
    ],
    produce: [
        "garlic", "ginger", "scallion", "thai basil", "cilantro", "thai chili pepper", "fresno pepper", "cucumber", "celery", "mungbean sprouts", "serrano pepper", "jalapeno pepper"
    ],
    pantry: [
        "rice", "cornstarch", "chicken stock", "flour", "velveeta shells and cheese", "cream of mushroom soup", "dried beans", "egg white"
    ],
    condiment_oil: [
        "dark soy sauce", "light soy sauce", "shaoxing wine", "michiu wine", "green sichuan peppercorn oil", "vegetable oil", "sesame oil", "lard"
    ],
    seasoning_spice: [
        "sichuan peppercorn", "green sichuan peppercorn", "msg", "salt", "black pepper", "white pepper", "bay leaf", "oregano", "paprika", "dried chili pepper", "fermented bean paste (doubanjiang)", "sugar"
    ]
};

const ingredientTypeName = {
    protein: "Protein",
    produce: "Produce",
    pantry: "Pantry",
    condiment_oil: "Condiments & Oils",
    seasoning_spice: "Seasonings & Spices"
};

const recipes = [
    {
        name: "Three Cup Chicken (San Bei Ji)",
        cuisine: "Taiwanese",
        difficulty: "Intermediate",
        cook_mins: 45,
        clean_mins: 10,
        ingredients: [
            "chicken thigh", "thai basil", "garlic", "ginger", "sesame oil", "vegetable oil", "dried chili pepper", "shaoxing wine", "dark soy sauce", "light soy sauce", "sugar"
        ],
        recipeImage: "/images/sanbeiji.jpg",
        imgCredit: "Photo by Sarah from The Woks of Life",
        imgCreditUrl: "https://thewoksoflife.com/three-cup-chicken-san-bei-ji/"
    },
    {
        name: "Soup Beans",
        cuisine: "Southern",
        difficulty: "Easy",
        cook_mins: 40,
        clean_mins: 5,
        ingredients: [
            "dried beans", "chicken stock", "garlic", "salt", "black pepper", "bay leaf", "oregano", "paprika"
        ],
        recipeImage: "/images/soupbeans.jpg",
        imgCredit: "Photo by Robyn Stone on Add a Pinch",
        imgCreditUrl: "https://addapinch.com/pinto-bean-supper-favorite-southerisms/"
    },
    {
        name: "Ken's Chicken Casserole",
        cuisine: "Southern",
        difficulty: "Easy",
        cook_mins: 40,
        clean_mins: 5,
        ingredients: [
            "velveeta shells and cheese", "cream of mushroom soup", "canned chicken"
        ],
        recipeImage: "",
        imgCredit: "",
        imgCreditUrl: ""
    },
    {
        name: "Mapo Tofu",
        cuisine: "Sichuan",
        difficulty: "Intermediate",
        cook_mins: 35,
        clean_mins: 10,
        ingredients: [
            "firm silken tofu", "ground pork", "garlic", "ginger", "thai chili pepper", "scallion", "sichuan peppercorn", "fermented bean paste (doubanjiang)", "msg", "salt"
        ],
        recipeImage: "/images/mapotofu.jpg",
        imgCredit: "Photo by Wang Gang",
        imgCreditUrl: "https://www.youtube.com/watch?v=KpnLLhBVIjk"
    },
    {
        name: "Green Sichuan Pepper Fish (Teng Jiao Yu)",
        cuisine: "Sichuan",
        difficulty: "Advanced",
        cook_mins: 60,
        clean_mins: 20,
        ingredients: [
            "whole mackerel", "lard", "vegetable oil", "ginger", "garlic", "scallion", "chicken stock", "salt", "msg", "white pepper", "shaoxing wine", "egg white", "cornstarch", "cucumber", "celery", "mungbean sprouts", "green sichuan peppercorn oil", "serrano pepper", "jalapeno pepper", "green sichuan peppercorn"
        ],
        recipeImage: "/images/qinghuajiaoyu.jpg",
        imgCredit: "Photo by Taylor Holliday on the Mala Market",
        imgCreditUrl: "https://blog.themalamarket.com/green-sichuan-pepper-fish-qing-hua-jiao-yu/"
    },
    {
        name: "Whole Fried Mala Fish",
        cuisine: "Sichuan",
        difficulty: "Intermediate",
        cook_mins: 60,
        clean_mins: 20,
        ingredients: [
            "whole mackerel", "thai chili pepper", "fresno pepper", "green sichuan peppercorn oil", "vegetable oil", "cilantro", "garlic", "ginger", "msg", "salt", "michiu wine", "white pepper", "flour", "fermented bean paste (doubanjiang)"
        ],
        recipeImage: "",
        imgCredit: "",
        imgCreditUrl: ""
    }
];

// console.log(recipes);
// console.log(ingredients_DB);

const getAll = () => recipes;

const getItem = (name) => {
    const selectedRecipe = recipes.find(selectedRecipe => selectedRecipe.name.toLowerCase() === name.toLowerCase());

    //sort ingredients
    const sortedIngredients = {};
        
    for (const ingredientType in ingredients_DB) {
        const displayName = ingredientTypeName[ingredientType];
        sortedIngredients[displayName] = selectedRecipe.ingredients.filter(ingredient =>
            ingredients_DB[ingredientType].includes(ingredient)
        );
    }
    return { ...selectedRecipe, sortedIngredients };
}

export { getAll, getItem };