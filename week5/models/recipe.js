import mongoose from 'mongoose';
const { Schema } = mongoose;

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

export default mongoose.model('Recipe', recipeSchema);