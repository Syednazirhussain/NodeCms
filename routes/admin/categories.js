const express = require('express');
const router = express.Router();
const Category = require('./../../models/Category')

router.all('/admin', (req, res, next) => {

    res.app.locals.layout = 'admin';
    next();
});

router.get('/', (req, res) => {
    Category.find({})
        .then((categories) => {
            res.render('admin/category/index', {categories: categories})  
        })
        .catch(error => {
            req.flash('error_message', 'Error: '+JSON.stringify(error))
            res.render('admin/category/index')
        })
});

router.post('/store', (req, res) => {
    const category = new Category();
    category.name = req.body.name
    category.save().then(category => {
       if (Object.keys(category).length != 0) {
            req.flash('success_message', 'Category created successfully.')
            res.redirect('/admin/categories')
       } else {
           req.flash('error_message', 'Category not created!')
       }
    }).catch(error => {
        req.flash('error_message', 'Error: '+JSON.stringify(error))
    })
})


router.get('/:id', (req, res) => {
    if (req.params.hasOwnProperty('id')) {
        Category.findOne({_id: req.params.id})
            .then(category => {
                res.render('admin/category/edit', {category: category})
            })
            .catch(error => {
                console.log('Error: '+error)
            })
    } else {
        req.flash('error_message', 'Params not found!')
        res.redirect('/admin/categories');
    }
})

router.put('/update/:id', (req, res) => {
    Category.findOne({_id: req.param('id')}).then(category => {
        category.name = req.body.name
        category.save().then(category => {
            req.flash('success_message', 'Category updated successfully')
        }).catch(error => {
            req.flash('error_message', 'Category are not updated')
        })
    }).catch(error => {
        req.flash('error_message', 'Error: '+error)
    })
    res.redirect('/admin/categories')
})

router.delete(':id', (req, res) => {
    console.log()
})


module.exports = router;