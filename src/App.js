import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import GameList from './Pages/GameList.jsx';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/games" element={<GameList/>}/>
        </Routes>
    </BrowserRouter>
    );
}

export default App;
