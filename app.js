const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const flash = require('connect-flash')

mongoose.Promise = global.Promise 
mongoose.connect('mongodb://localhost:27017/cms').then((db) => {
    console.log('MongoDB Conenected!');
}).catch(error => { console.log('Could not connect :'+ error) })

const { select, formatDate, empty, optionsList } = require('./helpers/handlebars-helper');
const app = express();

app.use(express.static(path.join(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(fileUpload())
app.use(session({
    secret: 'syednazirhussainilovepakistan',
    resave: true,
    saveUninitialized: true,
}))
app.use(flash())
app.use((req, res, next) => {
    res.locals.success_message = req.flash('success_message')
    res.locals.error_message = req.flash('error_message')
    next()
})


app.engine('handlebars', exphbs({ 
    defaultLayout: 'home', 
    helpers: {
        empty: empty,
        select: select, 
        optionsList: optionsList, 
        formatDate: formatDate,
    }
}));
app.set('view engine', 'handlebars');
app.listen(4500, (error) => {
    console.log('Server is running at port 4500')
});


const home = require('./routes/home/index')
const admin = require('./routes/admin/index')
const posts = require('./routes/admin/posts')
const categories = require('./routes/admin/categories')

app.use('/', home)
app.use('/admin', admin)
app.use('/admin/posts', posts)
app.use('/admin/categories', categories)

