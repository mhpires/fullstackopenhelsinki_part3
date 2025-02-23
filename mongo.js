const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

// otherwise we are adding a person to the phonebook

const url =
  `mongodb+srv://mhsrib:${password}@cluster0.i2nlv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

// if only 3 arguments are given, current db entries will be printed

if (process.argv.length == 3) {
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
        mongoose.connection.close()
      })
}

if (process.argv.length == 5) {
    
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        "name": name, 
        "number": number
    }) 
    
    person.save().then(result => {
      console.log(`added ${name} number ${number} to phonebook`)
      mongoose.connection.close()
    })
}
