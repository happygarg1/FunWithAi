import React from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import AiTools from '../components/AiTools'
import Plan from '../components/Plan'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
        <Navbar/>
        <Hero/>
        <AiTools/>
        <Plan/>
        <Footer/>
    </>
  )
}

export default Home