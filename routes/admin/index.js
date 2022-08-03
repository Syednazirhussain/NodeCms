const express = require('express')
const router = express.Router()
const faker = require('faker')
const Post = require('../../models/Posts')
const { userAuthenticated } = require('./../../helpers/authentication')


router.all('/*', userAuthenticated, (req, res, next) => {
    res.locals.layout = 'admin'
    next()
})

router.post('/generate-fake-posts', (req, res) => {

    for(let i = 0; i < req.body.amount; i++) {
        let post = new Post();
        post.title = faker.name.title()
        post.status = 'public'
        post.allowComments = faker.random.boolean();
        post.body = faker.lorem.sentence();
        post.save(function(error) {
            if (error) {
                throw error
            }
        })
    }
    res.redirect('/admin/posts')
})

router.get('/', (req, res) => { 

    res.render('admin/index', { 'currentYear': new Date().getFullYear() });
});

module.exports = router