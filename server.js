// Importeer het npm package Express (uit de door npm aangemaakte node_modules map)
// Deze package is geïnstalleerd via `npm install`, en staat als 'dependency' in package.json
import express from 'express'

// Importeer de Liquid package (ook als dependency via npm geïnstalleerd)
import { Liquid } from 'liquidjs';

// Je kunt de volgende URLs uit onze API gebruiken:
// - https://fdnd.directus.app/items/tribe
// - https://fdnd.directus.app/items/squad
// - https://fdnd.directus.app/items/person
// En combineren met verschillende query parameters als filter, sort, search, etc.
// Gebruik hiervoor de documentatie van https://directus.io/docs/guides/connect/query-parameters
// En de oefeningen uit https://github.com/fdnd-task/connect-your-tribe-squad-page/blob/main/docs/squad-page-ontwerpen.md

// Haal alle eerstejaars squads uit de WHOIS API op van dit jaar (2024–2025)
const squadResponse = await fetch('https://fdnd.directus.app/items/squad?filter={"_and":[{"cohort":"2425"},{"tribe":{"name":"FDND Jaar 1"}}]}')

// Lees van de response van die fetch het JSON object in, waar we iets mee kunnen doen
const squadResponseJSON = await squadResponse.json()

// Controleer de data in je console (Let op: dit is _niet_ de console van je browser, maar van NodeJS, in je terminal)
// console.log(squadResponseJSON)


// Maak een nieuwe Express applicatie aan, waarin we de server configureren
const app = express()

// Gebruik de map 'public' voor statische bestanden (resources zoals CSS, JavaScript, afbeeldingen en fonts)
// Bestanden in deze map kunnen dus door de browser gebruikt worden
app.use(express.static('public'))

// Stel Liquid in als 'view engine'
const engine = new Liquid();
app.engine('liquid', engine.express()); 

// Stel de map met Liquid templates in
// Let op: de browser kan deze bestanden niet rechtstreeks laden (zoals voorheen met HTML bestanden)
app.set('views', './views')


// Zorg dat werken met request data makkelijker wordt
app.use(express.urlencoded({extended: true}))

let messages = []

app.get('/berichten', async function (request, response) { 
  response.render('messages.liquid', {messages: messages})
})

app.post('/berichten', async function (request, response) {
  messages.push(request.body.tekstje)
// console.log(messages)
  response.redirect(303, '/berichten')
})



// Om Views weer te geven, heb je Routes nodig
// Maak een GET route voor de index
app.get('/', async function (request, response) {
  // Haal alle personen uit de WHOIS API op, van dit jaar
  const personResponse = await fetch('https://fdnd.directus.app/items/person/?fields=*,squads.squad_id.name&filter=%7B%22squads%22:%7B%22squad_id%22:%7B%22name%22:%221H%22%7D%7D%7D&sort=name')

  // En haal daarvan de JSON op
  const personResponseJSON = await personResponse.json()
  
  // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
  // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

  // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
  // Geef ook de eerder opgehaalde squad data mee aan de view
  response.render('index.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data})
})

// // Om Views weer te geven, heb je Routes nodig
// // Maak een GET route voor de index
// app.get('/teamcool', async function (request, response) {
//   // Haal alle personen uit de WHOIS API op, van dit jaar
//   const personResponse = await fetch('https://fdnd.directus.app/items/person/?filter=%7B%22team%22:%22Cool%22%7D')

//   // En haal daarvan de JSON op
//   const personResponseJSON = await personResponse.json()
  
//   // personResponseJSON bevat gegevens van alle personen uit alle squads van dit jaar
//   // Je zou dat hier kunnen filteren, sorteren, of zelfs aanpassen, voordat je het doorgeeft aan de view

//   // Render index.liquid uit de views map en geef de opgehaalde data mee als variabele, genaamd persons
//   // Geef ook de eerder opgehaalde squad data mee aan de view
//   response.render('team-cool.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data})
// })

// // Team awesome
// app.get('/teamawesome', async function (request, response) {
//   const personResponse = await fetch('https://fdnd.directus.app/items/person/?filter=%7B%22team%22:%22Awesome%22%7D')
//   const personResponseJSON = await personResponse.json()
//   response.render('team-awesome.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data})
// })

// // Team blaze
// app.get('/teamblaze', async function (request, response) {
//   const personResponse = await fetch('https://fdnd.directus.app/items/person/?filter=%7B%22team%22:%22Blaze%22%7D')
//   const personResponseJSON = await personResponse.json()
//   response.render('team-blaze.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data})
// })

// // Team chill
// app.get('/teamchill', async function (request, response) {
//   const personResponse = await fetch('https://fdnd.directus.app/items/person/?filter=%7B%22team%22:%22Chill%22%7D')
//   const personResponseJSON = await personResponse.json()
//   response.render('team-chill.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data})
// })

// //  Team rad
// app.get('/teamrad', async function (request, response) {
//   const personResponse = await fetch('https://fdnd.directus.app/items/person/?filter=%7B%22team%22:%22Rad%22%7D')
//   const personResponseJSON = await personResponse.json()
//   response.render('team-rad.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data})
// })

// //  Team rocket
// app.get('/teamrocket', async function (request, response) {
//   const personResponse = await fetch('https://fdnd.directus.app/items/person/?filter=%7B%22team%22:%22Rocket%22%7D')
//   const personResponseJSON = await personResponse.json()
//   response.render('team-rocket.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data})
// })

// //  Team spirit
// app.get('/teamspirit', async function (request, response) {
//   const personResponse = await fetch('https://fdnd.directus.app/items/person/?filter=%7B%22team%22:%22Spirit%22%7D')
//   const personResponseJSON = await personResponse.json()
//   response.render('team-spirit.liquid', {persons: personResponseJSON.data, squads: squadResponseJSON.data})
// })

// // Maak een POST route voor de index; hiermee kun je bijvoorbeeld formulieren afvangen
// app.post('/', async function (request, response) {
//   // Je zou hier data kunnen opslaan, of veranderen, of wat je maar wilt
//   // Er is nog geen afhandeling van POST, redirect naar GET op /
//   response.redirect(303, '/')
// })


// // Maak een GET route voor een detailpagina met een route parameter, id
// // Zie de documentatie van Express voor meer info: https://expressjs.com/en/guide/routing.html#route-parameters
// app.get('/student/:id', async function (request, response) {
//   // Gebruik de request parameter id en haal de juiste persoon uit de WHOIS API op
//   const personDetailResponse = await fetch('https://fdnd.directus.app/items/person/' + request.params.id)
//   // En haal daarvan de JSON op
//   const personDetailResponseJSON = await personDetailResponse.json()
  
//   // Render student.liquid uit de views map en geef de opgehaalde data mee als variable, genaamd person
//   // Geef ook de eerder opgehaalde squad data mee aan de view
//   response.render('student.liquid', {person: personDetailResponseJSON.data, squads: squadResponseJSON.data})
// })


app.get('/teams/:team', async function (request, response) {
  console.log(request.params.team)

  const teamResponse = await fetch (`https://fdnd.directus.app/items/person/?filter={"team":{"_icontains":"${request.params.team}"}}`)
  const teamResponseJSON = await teamResponse.json()

  console.log(teamResponseJSON.data)

  response.render('teamleden.liquid', {persons: teamResponseJSON.data, squads: squadResponseJSON.data, team_name: request.params.team})
})


// Stel het poortnummer in waar express op moet gaan luisteren
app.set('port', process.env.PORT || 8000)

// Start express op, haal daarbij het zojuist ingestelde poortnummer op
app.listen(app.get('port'), function () {
  // Toon een bericht in de console en geef het poortnummer door
  console.log(`Application started on http://localhost:${app.get('port')}`)
})

