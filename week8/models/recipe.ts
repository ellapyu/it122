import mongoose from 'mongoose';
const { Schema } = mongoose;
import { Ingredient } from "./ingredient.js";

// define data model as JSON key/value pairs
// values indicate the data type of each key
const recipeSchema = new Schema({
    name: { type: String, required: true },
    cuisine: String,
    difficulty: String,
    cook_mins: Number,
    clean_mins: Number,
    ingredients: [{ type: Schema.ObjectId, ref: 'Ingredient'}],
    recipeImage: String,
    imgCredit: String,
    imgCreditUrl: String
});

export interface Recipe {
    _id: string;
    name: string;
    cuisine?: string | null;
    difficulty?: string | null;
    cook_mins?: number | null;
    clean_mins?: number | null;
    ingredients: Ingredient[]; 
    recipeImage?: string | null;
    imgCredit?: string | null;
    imgCreditUrl?: string | null;
  }

export default mongoose.model('Recipe', recipeSchema);