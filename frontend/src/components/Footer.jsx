import React from 'react'
import { Box, Typography } from '@mui/material'

const Footer = ({ text }) => {
  return (
    <Box
      component="footer"
      sx={{
        textAlign: 'center',
        py: 2,
        backgroundColor: '#f0f0f0',
        boxShadow: '0 -2px 4px rgba(0,0,0,0.05)',
        mt: 'auto',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        {text || '© 2025 Three Tier Demo | All Rights Reserved'}
      </Typography>
    </Box>
  )
}

export default Footer
