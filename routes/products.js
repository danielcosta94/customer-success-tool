var express = require('express');
var router = express.Router();

var Account = require('../models/account');
var Product = require('../models/product');

// GET All Products
router.get('/', function (req, res) {
    Product.getAllProducts(function (err, products) {
        if (!err) {
            res.status(200).json({products: products});
        } else {
            res.status(500).json({errors: [{msg: err.toString()}]});
        }
    })
});

// POST Create Product
router.post('/', function (req, res) {
    const name = req.body.name;
    const code = req.body.code;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('code', 'Code is required').notEmpty();

    const errors = req.validationErrors();

    if (!errors) {
        const newProduct = new Product({
            name: name,
            code: code
        });

        Product.createProduct(newProduct, function (err, result) {
            if (!err) {
                res.status(201).json({message: 'Product Created'});
            } else {
                res.status(500).json({errors: [{msg: err.toString()}]});
            }
        });
    } else {
        res.status(400).json({errors: errors});
    }
});

// GET Get Product By ID
router.get('/:id', function (req, res) {
    const product_id = req.params.id;

    Product.getProductByID(product_id, function (err, product) {
        if(product) {
            res.status(200).json(product);
        } else {
            res.status(200).json(null);
        }
    });
});

// PUT Update Product By ID
router.put('/:id', function (req, res) {
    const product_id = req.params.id;

    const name = req.body.name;
    const code = req.body.code;

    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('code', 'Code is required').notEmpty();

    const errors = req.validationErrors();

    if (!errors) {
        Product.getProductByID(product_id, function (err, product) {
            if (product) {
                const newProduct = {
                    name: name,
                    code: code
                };

                Product.updateProductByID(product_id, newProduct, function (err, result) {
                    if (!err) {
                        res.status(201).json({message: 'Product Updated'});
                    } else {
                        res.status(500).json({errors: [{msg: err.toString()}]});
                    }
                });
            } else {
                res.status(400).json({errors: [{msg: 'Product ID does not exists'}]});
            }
        });
    } else {
        res.status(400).json({errors: errors});
    }
});

// DELETE Delete Product By ID
router.delete('/:id', function (req, res) {
    const product_id = req.params.id;

    Account.getAccountsByProductID(product_id, function (err, accounts) {
        if (!err && accounts.length === 0) {
            Product.deleteProductByID(product_id, function (err, result) {
                if (!err) {
                    res.status(200).json({message: 'Product Deleted'});
                } else {
                    res.status(500).json({errors: [{msg: err.toString()}]});
                }
            });
        } else {
            if (accounts) {
                res.status(400).json({errors: [{msg: 'Product ID is being used'}]});
            } else {
                res.status(400).json({errors: [{msg: 'Product ID does not exists'}]});
            }
        }
    });

});

module.exports = router;