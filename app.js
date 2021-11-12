const express = require('express')
const path = require('path')

const app = express()
const port = process.env.PORT || 5000


app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.static('public'))

app.listen(port, () => console.log('listening...'))

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/predefined-animations/:animation_name', (req, res) => {
    const name = req.params.name
    res.render('animation', name)
})