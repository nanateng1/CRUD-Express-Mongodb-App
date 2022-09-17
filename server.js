const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()

const connectionString = process.env.DB_STRING

// MongoClient.connect(connectionString, (err, client) => {
//   if (err) return console.error(err)
//   console.log('connected to Database')
//   const db = client.db('star-wars-quote')

// })

MongoClient.connect(connectionString, {useUnifiedTopology: true})
  .then(client => {
    console.log('Connected to Database')
    const db = client.db('star-wars-quote')
    const quotesCollection = db.collection('quotes')

    // ========================
    // Middlewares
    // ========================

    //setting template engine
    app.set('view engine', 'ejs')

    //makes Express accept input value from index.html
    app.use(bodyParser.urlencoded({extended: true}))

    //makes files in public folder accessible to Express
    app.use(express.static('./public'))

    //makes Express able to accept JSON
    app.use(bodyParser.json())

    // ========================
    // Routes
    // ========================
    //GET(READ)
    app.get('/', (req, res) => {
      quotesCollection
        .find()
        .toArray()
        .then(results => {
          res.render('index.ejs', {quotes: results})
        })
        .catch(error => console.error(error))
    })

    //POST(CREATE)
    app.post('/quotes', (req, res) => {
      quotesCollection
        .insertOne(req.body)
        .then(result => {
          // console.log(result)
          res.redirect('/')
        })
        .catch(error => console.error(error))
    })

    //PUT(UPDATE)
    app.put('/quotes', (req, res) => {
      console.log(req.body)
      quotesCollection
        .findOneAndUpdate(
          {name: 'Darth Vader'},
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then(result => {
          res.json('Success')
        })
        .catch(error => console.error(error))
    })

    //DELETE(DELETE)
    app.delete('/quotes', (req, res) => {
      quotesCollection
        .deleteOne({name: req.body.name})
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json("Deleted Darth Jinn's quote")
        })
        .catch(error => console.error(error))
    })

    app.listen(8000, () => {
      console.log("server is runing on port 8000 let's go catch it!")
    })
  })
  .catch(console.error)
