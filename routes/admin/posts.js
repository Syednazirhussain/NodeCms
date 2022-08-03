const express = require('express');
const router = express.Router();
const Post = require('../../models/Posts')
const Category = require('../../models/Category')
const fs = require('fs')
const { isEmpty, uploadDir } = require('./../../helpers/helper')

router.get('/', (req, res) => {
    Post.find({})
    .populate('category')
    .then(posts => {
        const data = {
            posts: posts
        }

        console.log(data)

        res.render('admin/posts/index', data);
    });
})

router.get('/create', (req, res) => {

    Category.find({})
    .then(categories => {
        let jsObj = {
            categories: categories
        }
        res.render('admin/posts/create', jsObj)
    }).catch(error => {
        req.flash('error_message', 'Error: '+ JSON.stringify(error))
        res.render('admin/posts/create')
    })
})

router.post('/store', (req, res) => {


    console.log(req.body)

    let allowComment = false
    if (!req.body.allowComments) {
        allowComment = true
    }
    const newPost = new Post();
    newPost.title = req.body.title
    newPost.status = req.body.status
    newPost.allowComments = allowComment
    newPost.body = req.body.body
    newPost.category = req.body.category
    if (!isEmpty(req.files)) {
        let file = req.files.file;
        newPost.file = Date.now() +'-'+ file.name;
        file.mv(uploadDir + newPost.file, (error) => {
            if (error) throw error;
        })
    }
    newPost.save().then(doc => {
        req.flash('success_message', 'Post created successfully')
        res.redirect('/admin/posts')
    }).catch(err => {
        req.flash('error_message', err)
        res.render('admin/posts/create', {errors: err.errors})
    })
})

router.get('/edit/:id', (req, res) => {
    Post.findOne({_id: req.params.id})
    .then(post => {
        Category.find({})
        .then(categories => {
            let jsObj = {
                post: post,
                categories: categories
            }
            return res.render('admin/posts/edit', jsObj)
        })
        .catch(error => {
            req.flash('error_message', 'Error: '+ JSON.stringify(error))
            return res.render('admin/posts/edit', {post: post})
        }) 
    }).catch(error => {
        req.flash('error_message', 'Error: '+ JSON.stringify(error))
        return res.render('admin/posts/edit')
    })
})

router.put('/update/:id', (req, res) => {

    Post.findOne({_id: req.params.id}).then(post => {

        if (req.body.allowComments) {
            allowComments = true
        } else {
            allowComments = false
        }
        post.title = req.body.title;
        post.status = req.body.status;
        post.allowComments = allowComments;
        post.body = req.body.body;
        post.category = req.body.category;
        if (!isEmpty(req.files)) {
            fs.unlink(uploadDir + post.file, (err) => {
                let file = req.files.file;
                let filename = Date.now() +'-'+ file.name;
                file.mv(uploadDir + post.file, (error) => {
                    if (error) throw error;
                })
                post.file = filename
            })
        }
        post.save().then(updatePost => {
            req.flash('success_message', 'Post updated successfully')
            res.redirect('/admin/posts')
        }).catch(error => {
            req.flash('error_message', JSON.stringify(error))
            res.redirect('/admin/posts')
        })
    }).catch(error => {
        req.flash('error_message', JSON.stringify(error))
        res.redirect('/admin/posts')
    })
})

router.delete('/:id', (req, res) => {

    Post.findOne({_id: req.params.id})
    .then(post => {
        fs.unlink(uploadDir + post.file, (err) => {
            post.remove()
            req.flash('success_message', 'Post deleted successfully')
            return res.redirect('/admin/posts')
        })
    }).catch(error => {
        console.log(error)
    })
})

module.exports = router;