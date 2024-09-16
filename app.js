var express = require('express');
var fs = require('fs');
var path = require('path');
var app = express();
const PORT = 5000;

const eventsData = JSON.parse(fs.readFileSync(path.join(__dirname, 'data', 'events.json'), 'utf8'));
// set the view to engine ejs
app.set('view engine', 'ejs')


// use res.render to load up an ejs view file

//index page
app.get('/', function(req, res) {
    res.render('pages/events',{
        events: eventsData,
    })
})

// admin page
app.get('/admin', function(req, res){
    res.render('pages/admin')
})

app.listen(PORT, ()=>{
    console.log(`listening on port ${PORT}`)
})