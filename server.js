const express = require('express');
const hbs = require('hbs');
const fs = require('fs');

//process.env is an object that holds all of our environmental variables in key value pairs
const port = process.env.PORT || 4000; ///The PORT is for heroku and 4000 is for the local server
var app = express(); //there are no arguments going into express

//we have to register partials so that we don't have to keep modifying certain parts like header and footer
hbs.registerPartials(__dirname + '/views/partials')
app.set('view engine', 'hbs');//we are going to pass in a key value pair

//use method of express lets us use middleware
//__dirname reqresents the path to your projects directory, in this case goes to nodewebserver
// app.use(express.static(__dirname + '/public'));// here we taught express to read from a static directory
//app.use is how you register middleware
app.use((req, res, next) => { //only when next is called like this next()
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`//method is get and url is /
  console.log(log);
  fs.appendFile('server.log', log + '\n', (err) => {
    if (err) {
      console.log('unable to append to server.log');
    }
  });
  next(); //without this then when you try to refresh the webpage, it will hang and not refresh
});

app.use((req, res, next) => {
  res.render('maintenance.hbs');
}); //this middleware is going to stop everything after it from executing because there is no next()

app.use(express.static(__dirname + '/public'));//moved dow n here because of maintenance middleware
hbs.registerHelper('getCurrentYear', () => {
  return new Date().getFullYear();
}); //first argument is the names of the function and the second is the function to run

hbs.registerHelper('screamIt', (text)=> {
  return text.toUpperCase();
})

// app.get('/', (req, res) => {
//   // res.send('<h1>hello express!</h1>');
//   res.send({
//     name: 'gerdson',
//     likes: [
//       'pizza',
//       'cities'
//     ]
//   })
// })

//with app.get, we can specify any route we make
app.get('/about', (req, res) => {
  res.render('about.hbs', {
    pageTitle: 'About page',
    // currentYear: new Date().getFullYear() // we removed it because we now have the registerhelper
  }); //its render not send because send will send the string and not the
});

app.get('/' ,(req,res) => {
  res.render('home.hbs', {
    pageTitle: 'HomePage',
    welcomeMessage: 'Welcome to my website',
    // currentYear: new Date().getFullYear()
  })
})

app.get('/bad', (req, res) => {
  res.send({
    errorMessage: 'error handling request'
  })
})

app.listen(port, () => {
  console.log(`The server is up on port ${port}`);
});
