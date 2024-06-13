const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]


//Älä jumankauta jätä salasanaa tohon!!
const url =
  `mongodb+srv://topipurtola:${password}@cluster0.kdoxkil.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const tyyppiSchema = new mongoose.Schema({
  name: String, 
  number: String, 
})


const Yhteystieto = mongoose.model('Yhteystiedot', tyyppiSchema)


const yhteystieto = new Yhteystieto({
  name: process.argv[3],
  number: process.argv[4]
})

if (yhteystieto.name != null && yhteystieto.number != null) {
  yhteystieto.save().then(result => {  
    console.log('Added ' + yhteystieto.name + " number " + yhteystieto.number + " to phonebook")
    mongoose.connection.close()
  })
}
else{
  Yhteystieto.find({}).then(result => {
    console.log("Phonebook:")
    result.forEach(yhteystieto => {
      console.log(yhteystieto.name, yhteystieto.number)
    })
    mongoose.connection.close()
  })
}
