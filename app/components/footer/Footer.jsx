'use client';
import React from 'react'
import { hideHeaderFooter } from '@/app/lib/utils'
import { usePathname } from 'next/navigation'
import { Box } from '@mui/material';


function Footer() {
  const pathname = usePathname()
  const shoulHide = hideHeaderFooter.includes(pathname)
  
  return (
    <Box 
      component="footer" 
      sx={{backgroundColor:'#f1f1f1', height:'300px', display: shoulHide ? 'none' : ''}}>

    </Box>
  )
}

export default Footer