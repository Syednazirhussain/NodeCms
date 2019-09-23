const express = require('express')
const router = express.Router();
const Post = require('./../../models/Posts')
const Category = require('./../../models/Category')

router.get('/', (req, res) => {
    Post.find().then(posts => {
        Category.find({})
        .then(categories => {
            let jsObj = {
                posts: posts,
                categories: categories,
            }
            res.render('home/index', jsObj)
        }).catch(error => {
            req.flash('error_message', 'Error: '+error)
        })
    }).catch(error => {
        req.flash('error_message', JSON.stringify(error))
        res.render('home/index');
    })
});

router.get('/post/:id', (req, res) => {

    Post.findById({_id: req.params.id})
    .then(post => {

        res.render('home/post', {post: post})
    })
    .catch(error => {
        console.log('Error: '+error)
    })

})

router.get('/about', (req, res) => {
    return res.render('home/about')
})

router.get('/login', (req, res) => {
    return res.render('home/login')
})

router.get('/register', (req, res) => {
    return res.render('home/register')
})

module.exports = router