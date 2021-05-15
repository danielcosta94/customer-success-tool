var mongoose = require('mongoose');

// Product Schema
const ProductSchema = mongoose.Schema({
    name: {
        type: String,
        index: true,
        unique: true
    },
    code: {
        type: String,
        index: true,
        unique: true
    }
});

let Product = module.exports = mongoose.model('Product', ProductSchema);

module.exports.createProduct = function(newProduct, callback){
    newProduct.save(callback);
};

module.exports.deleteProductByID = function(id, callback){
    Product.remove({_id: id}, callback);
};

module.exports.updateProductByID = function(id, newProduct, callback){
    Product.update({_id: id}, newProduct, callback);
};

module.exports.getAllProducts = function(callback) {
    Product.find(callback);
};

module.exports.getLicenseByID = function(license, callback) {
    Product.find({license: license}, callback);
};

module.exports.getAllProductsCodes = function(callback) {
    Product.find(function (err, products) {
        let productsList = [];

        products.forEach(function (product) {
            productsList.push(product.code)
        });
        callback(null, productsList);
    });
};

module.exports.getAllProductsLowerCase = function(callback) {
    let productsList = [];

    products.forEach(function (product) {
        productsList.push(product.toLowerCase());
    });
    callback(productsList)
};

module.exports.getProductByID = function(id, callback){
    Product.findById(id, callback);
};

module.exports.getProductByCode = function(code, callback){
    Product.findOne({code: code}, callback);
};

module.exports.getProductByName = function(name, callback){
    Product.findOne({name: name}, callback);
};