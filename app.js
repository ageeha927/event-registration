const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const PORT = 5000
const path = require('path')

const eventsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'events.json'), 'utf8'));
// set the view to engine ejs
app.set('view engine', 'ejs')

app.use('/public', express.static('public'))

// use res.render to load up an ejs view file

//index page
app.get('/', function(req, res) {
    const events = getEvents()
    res.render('pages/events',{
        events})
})

app.get('/home', function(req, res){
    const events = getEvents()
    res.render('pages/user',{
        events})
})

app.get('/submit', function(req, res){
    const events = getEvents()
    res.render('pages/submit',{
        events})
})


app.use(bodyParser.urlencoded({ extended: true}))
app.use(express.static('public'))
app.set('view engine', 'ejs')

//Load events from the JSON file
const getEvents = () =>{
    const eventsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'events.json'), 'utf8'))
    return eventsData
}

const saveEvents = (events) => {
    fs.writeFileSync('./data/events.json', JSON.stringify(events, null, 2))
}

//Routes

//GET: Show all events
// app.get('/', (req, res)=>{
//     const events = getEvents()
//     res.render('events', { events })
// })

//POST: Create a new event
app.post('/edit', (req,res) => {
    const events = getEvents();
    const newEvent = {
        id: events.length+1,
        name:req.body.name,
        date:req.body.date,
        description: req.body.description
    }
    events.push(newEvent)
    saveEvents(events)
    res.redirect('/')
})

//GET : Show a single event (for editing)
app.get('/edit/:id/edit', (req,res)=>{
    const events = getEvents()
    const event = events.find(event => event.id == req.params.id)
    res.render('pages/edit', {event})
})

//PUT: Update a event
app.post('/edit/:id', (req,res)=>{
    const events = getEvents()
    const eventIndex = events.findIndex(event => event.id == req.params.id)
    events[eventIndex].description = req.body.description
    events[eventIndex].name = req.body.name
    events[eventIndex].date = req.body.date
    console.log(events[eventIndex])
    saveEvents(events)
    res.redirect('/')
})

//DELETE: Delete a event
app.post('/edit/:id/delete', (req,res)=> {
    let events = getEvents()
    events = events.filter(event => event.id != req.params.id)
    saveEvents(events)
    res.redirect('/')
})

//Server
app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})

// Route to handle form submission
app.post('/submit', (req, res) => {
    console.log(req.body.event)
    const data = {
        firstName: req.body.fname,
        lastName: req.body.lname,
        email: req.body.email,
        event: req.body.event
    }

    // Read existing data
    fs.readFile('./data/registered.json', (err, fileData) => {
        let json = []
        if (!err) {
            json = JSON.parse(fileData)
        }
        json.push(data)
        fs.writeFile('./data/registered.json', JSON.stringify(json, null, 2), (err) => {
            if (err) {
                return res.status(500).send('Error writing to file')
            }
            res.redirect('/submit')
        })
    })
})