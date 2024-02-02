import express from 'express'
import axios from 'axios'
import pkg from 'pg'
import cors from 'cors'

const { Pool } = pkg

const app = express()

app.use(cors())

const port = 5100

const dbUrl =
  'postgresql://poorneshchenna29:0PnousKlyh6c@ep-patient-dust-41051177.ap-southeast-1.aws.neon.tech/quadb?sslmode=require'

const pool = new Pool({
  connectionString: dbUrl,
})

app.use(express.json())

app.get('/', (req, res) => {
  res.status(200).send('Server is up and running')
})

app.get('/fetch-and-store', async (req, res) => {
  try {
    const apiResponse = await axios.get('https://api.wazirx.com/api/v2/tickers')
    const top10Results = Object.values(apiResponse.data).slice(0, 10)
    await pool.query('DELETE FROM cryptocurrency_data')
    for (const result of top10Results) {
      const { name, last, buy, sell, volume, base_unit } = result
      await pool.query(
        'INSERT INTO cryptocurrency_data (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)',
        [
          name,
          parseFloat(last).toFixed(2),
          parseFloat(buy).toFixed(2),
          parseFloat(sell).toFixed(2),
          volume,
          base_unit,
        ]
      )
    }

    res
      .status(200)
      .json({ success: true, message: 'Data stored successfully.' })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({ success: false, message: 'Internal Server Error.' })
  }
})

app.get('/getData', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cryptocurrency_data')
    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

app.listen(port, () => {
  console.log(`Server is running on port:${port}`)
})
