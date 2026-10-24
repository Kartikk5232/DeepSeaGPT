import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import 'leaflet/dist/leaflet.css'

export default function App() {
  const chats = [
    'What is the temperature trend in the Pacific?',
    'Explain salinity spike near Arctic.',
    'Compare Indian vs Atlantic Ocean profiles.',
  ]

  const cards = [
    'Global Temperature',
    'Salinity vs Depth',
    'Thermocline Trend',
    'Float Activity',
  ]

  const [oceanData, setOceanData] = useState([])
  const [query, setQuery] = useState('')
  const [chatHistory, setChatHistory] = useState([
    { role: 'user', text: 'What is the temperature trend in the Pacific?' },
    { role: 'ai', text: 'Ask about highest salinity, warmest location, or tsunami-prone regions.' }
  ])
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/ocean/live")
      .then(res => res.json())
      .then(data => {
        console.log(data)
        setOceanData(data)
      })
      .catch(err => console.error(err))
  }, [])

  const handleQuery = async () => {
    if (!query.trim()) return

    const userMessage = { role: 'user', text: query }
    const newChat = [...chatHistory, userMessage]

    setChatHistory(newChat)
    setQuery('')
    setLoading(true)

    try {
      const res = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userMessage.text })
      })
      const data = await res.json()
      setChatHistory([...newChat, { role: 'ai', text: data.answer }])
    } catch (err) {
      console.error(err)
      setChatHistory([...newChat, { role: 'ai', text: 'Error connecting to server.' }])
    } finally {
      setLoading(false)
    }
  }
  const styles = {
    page: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #020617, #0c4a6e, #082f49)',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      padding: '20px',
    },
    header: {
      background: 'rgba(255,255,255,0.08)',
      padding: '20px',
      borderRadius: '20px',
      marginBottom: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: '3fr 1fr',
      gap: '20px',
    },
    card: {
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '20px',
      padding: '20px',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    },
    map: {
      height: '320px',
      borderRadius: '16px',
      background: 'rgba(255,255,255,0.05)',
      marginTop: '12px',
      overflow: 'hidden',
    },
    cardsGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '20px',
      marginTop: '20px',
    },
    graph: {
      height: '180px',
      borderRadius: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'rgba(255,255,255,0.05)',
      border: '1px dashed rgba(255,255,255,0.2)',
      marginTop: '10px',
    },
    chatBox: {
      background: 'rgba(255,255,255,0.06)',
      padding: '12px',
      borderRadius: '12px',
      marginBottom: '10px',
      fontSize: '14px',
    },
    textarea: {
      width: '100%',
      height: '120px',
      borderRadius: '12px',
      padding: '12px',
      marginTop: '15px',
      border: 'none',
      outline: 'none',
      resize: 'none',
    },
    button: {
      width: '100%',
      marginTop: '12px',
      padding: '14px',
      borderRadius: '12px',
      border: 'none',
      background: 'linear-gradient(90deg, #06b6d4, #2563eb)',
      color: 'white',
      fontWeight: 'bold',
      cursor: 'pointer',
      opacity: loading ? 0.7 : 1,
    },
    chatBoxUser: {
      background: 'rgba(255,255,255,0.1)',
      padding: '12px',
      borderRadius: '12px',
      marginBottom: '10px',
      fontSize: '14px',
      textAlign: 'right',
      borderLeft: '4px solid #06b6d4',
    },
    chatBoxAi: {
      background: 'rgba(255,255,255,0.06)',
      padding: '12px',
      borderRadius: '12px',
      marginBottom: '10px',
      fontSize: '14px',
      borderLeft: '4px solid #2563eb',
    },
  }

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={{ margin: 0 }}>Oceanly</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.8 }}>
          Conversational System for ARGO Ocean Data
        </p>
      </div>

      <div style={styles.grid}>
        <div>
          <div style={styles.card}>
            <h2>Live Global Ocean Map</h2>
            <div style={styles.map}>
              <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {oceanData.map((data, idx) => (
                  <CircleMarker
                    key={idx}
                    center={[data.latitude, data.longitude]}
                    radius={5}
                    pathOptions={{ color: '#06b6d4', fillColor: '#06b6d4', fillOpacity: 0.7 }}
                  >
                    <Popup style={{ color: 'black' }}>
                      <strong>Lat:</strong> {data.latitude?.toFixed(2)}<br />
                      <strong>Lon:</strong> {data.longitude?.toFixed(2)}<br />
                      <strong>Temp:</strong> {data.temperature ? data.temperature.toFixed(2) + ' °C' : 'N/A'}<br />
                      <strong>Salinity:</strong> {data.salinity ? data.salinity.toFixed(2) + ' PSU' : 'N/A'}
                    </Popup>
                  </CircleMarker>
                ))}
              </MapContainer>
            </div>
          </div>

          <div style={styles.cardsGrid}>
            <div style={styles.card}>
              <h3>Global Temperature</h3>
              <div style={styles.graph}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" dataKey="latitude" name="Latitude" stroke="#ccc" tick={{ fill: '#ccc', fontSize: 12 }} />
                    <YAxis type="number" dataKey="temperature" name="Temp (°C)" stroke="#ccc" tick={{ fill: '#ccc', fontSize: 12 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: 'white' }} />
                    <Scatter name="Temp" data={oceanData} fill="#f59e0b" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={styles.card}>
              <h3>Salinity vs Depth</h3>
              <div style={styles.graph}>
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis type="number" dataKey="salinity" name="Salinity (PSU)" domain={['dataMin - 0.5', 'dataMax + 0.5']} stroke="#ccc" tick={{ fill: '#ccc', fontSize: 12 }} />
                    <YAxis type="number" dataKey="pressure" name="Pressure (dbar)" reversed={true} stroke="#ccc" tick={{ fill: '#ccc', fontSize: 12 }} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px', color: 'white' }} />
                    <Scatter name="Salinity" data={oceanData} fill="#0ea5e9" />
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <div style={styles.card}>
          <h2>Ask DeepSeaGPT</h2>
          <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '10px' }}>
            {chatHistory.map((chat, idx) => (
              <div key={idx} style={chat.role === 'user' ? styles.chatBoxUser : styles.chatBoxAi}>
                <strong>{chat.role === 'user' ? 'You' : 'DeepSeaGPT'}:</strong> {chat.text}
              </div>
            ))}
          </div>

          <textarea
            style={styles.textarea}
            placeholder="Ask about highest salinity, warmest location..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleQuery()
              }
            }}
          />
          <button style={styles.button} onClick={handleQuery} disabled={loading}>
            {loading ? 'Thinking...' : 'Send Query'}
          </button>
        </div>
      </div>
    </div>
  )
}