const express = require('express')
const router = express.Router();
const Post = require('./../../models/Posts')

router.get('/', (req, res) => {

    Post.find().then(posts => {

        req.flash('success_message', 'Post retrive successfully')
        res.render('home/index', {posts: posts})
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