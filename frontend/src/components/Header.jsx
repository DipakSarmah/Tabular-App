import React from 'react'
import { AppBar, Toolbar, Typography } from '@mui/material'

const Header = ({ title }) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{
            flexGrow: 1,
            textAlign: 'center',
            fontWeight: 'bold',
            letterSpacing: '0.5px',
          }}
        >
          {title || 'Three Tier App'}
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default Header
