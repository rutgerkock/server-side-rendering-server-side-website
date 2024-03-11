// Importeer het npm pakket express uit de node_modules map
import express from 'express'

// Importeer de zelfgemaakte functie fetchJson uit de ./helpers map
import fetchJson from './helpers/fetch-json.js'

// Haal alle squads uit de WHOIS API op
const pizzaData = await fetchJson('https://fdnd-agency.directus.app/items/demo_pizzas')
const pastaData = await fetchJson('https://fdnd-agency.directus.app/items/demo_pastas')

// Maak een nieuwe express app aan
const app = express()

// Stel ejs in als template engine
app.set('view engine', 'ejs')

// Stel de map met ejs templates in
app.set('views', './views')

// Gebruik de map 'public' voor statische resources, zoals stylesheets, afbeeldingen en client-side JavaScript
app.use(express.static('public'))

// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))

// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8001)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

// Routes

// Maak een GET route voor de index
app.get('/', function (request, response) {
    response.render('homepage', {pastas: pastaData.data, pizzas: pizzaData.data});
})

app.get('/contact', function (request, response) {
    response.render('contact');
})

app.get('/pizzas', function (request, response) {
    response.render('pizzas', {pizzas: pizzaData.data});
})

app.get('/pizzas/:id', function (request, response) {
    fetchJson('https://fdnd-agency.directus.app/items/demo_pizzas?filter={"id":'+ request.params.id +'}').then((pizzaDetail) => {
        response.render('pizza', {
            pizza: pizzaDetail.data[0], 
            pizzas: pizzaData.data
        });
    });
})

app.get('/pastas', function (request, response) {
    response.render('pastas', {pastas: pastaData.data});
})

app.get('/pastas/:id', function (request, response) {
    fetchJson('https://fdnd-agency.directus.app/items/demo_pastas?filter={"id":'+ request.params.id +'}').then((pastasDataUitDeAPI) => {
        response.render('pasta', {pasta: pastasDataUitDeAPI.data[0], pastas: pastaData.data});
    });
})

// Maak een POST route voor de index
app.post('/', function (request, response) {
  // Er is nog geen afhandeling van POST, redirect naar GET op /
  response.redirect(303, '/')
})

// Maak een GET route voor een detailpagina met een request parameter id
app.get('/detail/:id', function (request, response) {
  // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
  fetchJson('https://fdnd.directus.app/items/person/' + request.params.id).then((apiData) => {
    // Render detail.ejs uit de views map en geef de opgehaalde data mee als variable, genaamd person
    response.render('detail', {person: apiData.data, squads: squadData.data})
  })
})