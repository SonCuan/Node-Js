const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: String,
    price: Number,
    images: String
});

module.exports = mongoose.model('Products', productSchema);