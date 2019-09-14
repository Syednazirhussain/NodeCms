const express = require('express')
const router = express.Router();

router.get('/', (req, res) => {

    res.render('home/index');
});

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