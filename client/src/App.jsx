import { Route , Routes } from 'react-router-dom';
import Home from './pages/Home';
import Interface from './pages/Interface';

import { Toaster } from 'react-hot-toast';
function App() {


  return (
    <div>
      <Toaster position="bottom-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collab/:roomId" element={<Interface />} />
      </Routes>
    </div>
  );
}

export default App
