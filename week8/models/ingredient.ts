import mongoose from 'mongoose';
const { Schema } = mongoose;

// define data model as JSON key/value pairs
// values indicate the data type of each key
const ingredientSchema = new Schema({
    name: { type: String, required: true },
    category: { type: String, required: true }
});

export interface Ingredient {
    _id: string;
    name: string;
    category: string;
}

export default mongoose.model('Ingredient', ingredientSchema);