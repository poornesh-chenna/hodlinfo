import { useEffect, useState } from 'react'
import './App.css'
import { IoMdRefresh } from 'react-icons/io'

function App() {
  const [data, setdata] = useState()
  const [refresh, setrefresh] = useState(false)

  const fetchAndStore = () => {
    fetch('http://localhost:5100/fetch-and-store')
      .then((response) => response.json())
      .then((data) => {
        console.log('Data from API:', data)
      })
      .catch((error) => {
        console.error('Error fetching data:', error)
      })
  }

  const fetchDataFromDB = () => {
    fetch('http://localhost:5100/getData')
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        setdata(data)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  useEffect(() => {
    fetchAndStore()
    fetchDataFromDB()
  }, [refresh])
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '90%',
          flexWrap: 'wrap',
          flexDirection: 'row',
          margin: '0 auto',
        }}
      >
        <div className="logo" style={{ margin: '20px 10px' }}>
          <img
            style={{
              width: '100%',
              height: '100%',
              padding: '10px',
              boxSizing: 'border-box',
              verticalAlign: 'middle',
              textAlign: 'center',
            }}
            src="/static/images/HODLINFO_logo.png"
            alt="logo"
          />
        </div>
        <div
          className="refresh"
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <button
            onClick={() => {
              setrefresh((prev) => !prev)
            }}
          >
            <IoMdRefresh style={{ fontSize: '24px' }} />
          </button>
        </div>
      </div>
      <div style={{ overflow: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Last Traded Price</th>
              <th>Buy / Sell Price</th>
              <th>Volume</th>
              <th>Base Unit</th>
            </tr>
          </thead>
          <tbody>
            {data &&
              data.map((crypto, idx) => {
                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{crypto.name}</td>
                    <td>{crypto.last}</td>
                    <td>
                      {crypto.buy} / {crypto.sell}
                    </td>
                    <td>{parseFloat(crypto.volume).toFixed(2)}</td>
                    <td>{crypto.base_unit}</td>
                  </tr>
                )
              })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default App
