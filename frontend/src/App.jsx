import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import DataTable from './components/DataTable'
import Header from './components/Header'
import Footer from './components/Footer'
import { getMeta } from './api'

const App = () => {
  const [meta, setMeta] = useState({ header: '', footer: '' })

  useEffect(() => {
    getMeta().then((res) => setMeta(res.data))
  }, [])

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh', // full screen height
        overflow: 'hidden', 
      }}
    >
      {/* Header */}
      <Header title={meta.header} />

      {/* Main content area */}
      <Box
        sx={{
          flex: 1,
          overflow: 'hidden', 
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'stretch',
          backgroundColor: '#fafafa',
          p: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <DataTable />
      </Box>

      {/* Footer */}
      <Footer text={meta.footer} />
    </Box>
  )
}

export default App
