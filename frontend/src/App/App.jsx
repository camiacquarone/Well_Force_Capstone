import React, { useState, useEffect } from "react"
import {BrowserRouter, Routes, Route } from "react-router-dom"
import axios from "axios"
import "./App.css";
import LandingPage from "../pages/LandingPage/LandingPage";



function App() {
    return(
        <div className="App">
            <BrowserRouter>
            <main>
                <Routes>
                    <Route path="/" element= {<LandingPage/>}

                    />
                </Routes>
            </main>
            
            </BrowserRouter>
        </div>
    )
}

export default App;