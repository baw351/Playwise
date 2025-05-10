import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home.jsx';
import GameList from './Pages/GameList.jsx';
import GameDetail from './Pages/GameDetail';
import GameTips from './Pages/GameTips';
import CreateTip from './Pages/CreateTip';
import './App.css';

function App() {
  return (
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/games" element={<GameList/>}/>
            <Route path="/game/:id" element={<GameDetail/>}/>
            <Route path="/game/:id/tips" element={<GameTips/>}/>
            <Route path="/game/:id/tips/create" element={<CreateTip/>}/>
        </Routes>
    </BrowserRouter>
  );
}

export default App;