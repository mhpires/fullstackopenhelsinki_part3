require('dotenv').config()
const Person = require('./models/person')
const express = require('express')
const cors = require('cors')
var morgan = require('morgan')
const app = express()

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

app.use(express.json())
app.use(cors())
app.use(express.static('dist'))

morgan.token('body', function (req, res) { 
    console.log(req.body)
    return JSON.stringify(req.body)
})
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :body"))

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send('<p>Phonebook has info for ' + persons.length + ' <br/>' + date+'<p>')
  })

const generateId = () => {
    return String(Math.floor(Math.random() * 10000))
}


app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name) {
    return response.status(400).json({ 
      error: 'name missing' 
    })
  }

  if (!body.number) {
    return response.status(400).json({ 
      error: 'number missing' 
    })
  }

  /*const exists = persons.some(person => person.name === body.name);

  if (exists){
    return response.status(400).json({ 
        error: 'name must be unique'
      })
  }*/

  const newPerson = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  newPerson.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })

  /*if (person) {
    response.json(person)
  } else {
    console.log('x')
    response.status(404).end()
  }*/
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.use(unknownEndpoint)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})