const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ExpenseTracker',
  password: 'chvb',
  port: 5432,
})

const getTransaction = (request, response) => {
    pool.query('SELECT * FROM transaction ORDER BY transactionId ASC', (error, results) => {
      if (error) {
        console.log(error.message)
        response.status(500).send(error.message)
      }
      response.status(200).json(results.rows)
    })
  }

  const getTransactionById = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('SELECT * FROM transaction WHERE transactionid = $1', [id], (error, results) => {
      if (error) {
        console.log(error.message)
        response.status(500).send(error.message)
      }
      response.status(200).json(results.rows)
    })
  }

  const createTransaction = (request, response) => {
    const { description, categoryid, amount, date } = request.body
  
    pool.query('INSERT INTO transaction ( description, categoryid, amount, date) VALUES ($1, $2, $3,$4) RETURNING *', [description, categoryid, amount, date], (error, results) => {
      if (error) {
        console.log(error.message)
        response.status(500).send(error.message)
      }
      response.status(201).send(results.rows[0])
    })
  }
  
  const updateTransaction = (request, response) => {
    const id = parseInt(request.params.id)
    const { description, categoryid, amount, date } = request.body
  
    pool.query(
      'UPDATE transaction SET description = $1, categoryid = $2, amount=$3, date=$4 WHERE transactionId = $5 RETURNING *',
      [description, categoryid, amount, date, id],
      (error, results) => {
        if (error) {
          console.log(error.message)
          response.status(500).send(error.message)
        }
        response.status(200).send(results.rows[0])
      }
    )
  }
  
  const deleteTransaction = (request, response) => {
    const id = parseInt(request.params.id)
  
    pool.query('DELETE FROM transaction WHERE transactionId = $1', [id], (error, results) => {
      if (error) {
        console.log(error.message)
          response.status(500).send(error.message)
      }
      response.status(200).send(`transactionId deleted with ID: ${id}`)
    })
  }
  
  module.exports = {
    getTransaction: getTransaction,
    getTransactionById: getTransactionById,
    createTransaction: createTransaction,
    updateTransaction: updateTransaction,
    deleteTransaction: deleteTransaction,
  }