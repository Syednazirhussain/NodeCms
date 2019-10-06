const express = require('express')
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

const User = require('./../../models/User')
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

router.post('/login', (req, res) => {

    User.findOne({email: req.body.email})
    .then(user => {
        console.log(req.body)
        console.log(user)
        bcrypt.compare(req.body.password, user.password, function(err, res) {
            console.log(res)
        })
    })
    .catch(error => {
        req.flash('error_message', 'Error: '+ JSON.stringify(error))
    })
})

passport.use(new LocalStrategy({usernameField: 'email'}, (email, password, done) => {
        User.findOne({ email: email }, function(err, user) {
            if (err)  throw err

            if (!user) {
                return done(null, false, { message: 'Incorrect email.' });
            } else {
                bcrypt.compare(password, user.password, (error, matched) => {
                    if (error) return error
                    if (matched) {
                        return done(null, user)
                    } else {
                        return done(null, false, {message: 'Incorrect password'})
                    }
                })
            }
        });
    }
))

router.get('/logout', (req, res) => {

    req.logOut()
    res.redirect('/')
})

passport.serializeUser(function(user, done) {
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.post('/login', (req, res, next) => {
    
    passport.authenticate('local', {
        successRedirect: '/admin',
        failureRedirect: '/login',
        failureMessage: true
    })(req, res, next)
    
})

router.get('/register', (req, res) => {
    return res.render('home/register')
})

router.post('/register', (req, res) => {


    let errors = []
    if (req.body.first_name == '') {
        errors.push('please enter first name')
    }
    if (req.body.last_name == '') {
        errors.push('please enter last name')
    }
    if (req.body.email == '') {
        errors.push('please enter email')
    }
    if (req.body.password == '') {
        errors.push('please enter password')
    }
    if (Object.keys(errors).length > 0) {

        req.flash('error_message', errors)
        res.render('home/register', req.body)
    } else {
        User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                bcrypt.genSalt(10, (error, salt) => {
                    bcrypt.hash(req.body.password, salt, (error, hash) => {
                        const user = new User({
                            firstName: req.body.first_name,
                            lastName: req.body.last_name,
                            email: req.body.email,
                            password: hash
                        })
                        user.validate(error => {
                            if (error) {
                                req.flash('error_message', 'Error: '+ JSON.stringify(error))
                            } else {
                                user.save()
                                .then(user => {
                                    req.flash('success_message', 'User register successfully.')
                                })
                                .catch(error => {
                                    req.flash('Error: '+ JSON.stringify(error))
                                })
                            }
                        })
                    })
                })
            } else {
                req.flash('error_message', 'Email already exists..')
            }
            res.redirect('/register')
        })
    }
})

module.exports = router