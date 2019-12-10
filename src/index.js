const express = require('express')
const exphbs = require('express-handlebars')
const path = require('path')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')
const redis = require('redis')

const port = 3000

const app = express();

/**
 * initail Redis
 */
const client = redis.createClient({ host: 'node-js-redis-server' });
client.on('connect', () => {
    console.log('Connect to Redis')
})

/**
 * set view engine
 */
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'hbs')

/**
 * set body parser
 */
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

/**
 * user method overide
 */
app.use(methodOverride('_method'))


app.get('/', (req, res, next) => {
    res.render('searchusers')
})

app.post('/user/search', (req, res, next) => {
    const { id } = req.body
    /**
     * get object data from Redis
     */
    client.hgetall(id, (err, object) => {
        if (!object) {
            res.render('searchusers', {
                error: 'User does not exist.'
            })
        } else {
            object.id = id
            res.render('details', {
                user: object
            })
        }
    })
})

app.get('/user/add', (req, res, next) => {
    res.render('adduser')
})

app.post('/user/add', (req, res, next) => {
    const { id, first_name, last_name, phone, email } = req.body
    client.hmset(id, [
        'first_name', first_name,
        'last_name', last_name,
        'email', email,
        'phone', phone
    ], (err, reply) => {
        if (err) {
            console.log(err)
        }
        console.log(reply)
        res.redirect('/')
    })
})

app.delete('/user/delete/:id', (req, res, next) => {
    client.del(req.params.id)
    res.redirect('/')
})

app.listen(port, () => {
    console.log('start on port ' + port)
})