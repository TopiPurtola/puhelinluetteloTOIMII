const { response } = require('express')
const { request } = require('express')
const express = require('express')
const morgan = require('morgan')
const app = express()
const cors = require('cors')
require('dotenv').config()
const yhtTiedot = require('./models/yhtTiedot')

app.use(cors())

morgan.token('postdata', function(req, res) {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
  return '-';
});

app.use(morgan(':method :url :status :response-time ms - :postdata'));

app.use(express.json());



const Lista = [ ]

  app.get('/', (request, response) => {
  response.send("pekka")    
})



app.post('/api/persons', (request, response) => {
  const body = request.body;
  
  if (!body.name || !body.number) {
    return response.status(400).json({ error: "Name or number not found" });
  }

  if (Lista.some(entry => entry.name === body.name)) {
    return response.status(409).json({ error: "Name must be unique" });
  }

  
/*
  const id = Math.floor(Math.random() * 100000);
  const currentDate = new Date(); 
*/
  const yhteystieto = new yhtTiedot({
  name: body.name,
  number: body.number,
  })

  yhteystieto.save().then(savedtieto => {
    response.json(savedtieto)
  })


/*
  return response.status(201).json({
    name: yhteystieto.name,
    number: yhteystieto.number,
    message: "Entry added successfully",
    id,
    date: currentDate.toISOString() 
  });
  */
 
});


app.get ('/info', (request,response) => {
  const currentDate = new Date(); 

    yhtTiedot.countDocuments({})
    .then(count => {
      response.send ("Phonebook has the info of "+ count +" people<br>"+currentDate)
    })
})

app.get('/api/persons', (request, response) => {
  yhtTiedot.find({}).then(Lista =>{
    response.json(Lista)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  yhtTiedot.findById(request.params.id)
    .then(yhteystieto => {
      if (yhteystieto) {
        response.json(yhteystieto)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (request, response, next) => {
  yhtTiedot.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})