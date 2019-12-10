const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const redis = require('redis')

const port = 3000

const app = express();

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.use(methodOverride('_method'))

app.get('/', (req, res, next) => {
    res.send('xxx')
})

app.listen(port, () => {
    console.log('start on port ' + port)
})