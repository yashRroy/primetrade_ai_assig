import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './component/login/Login';
import Signup from './component/signup/Signup';
import Dashbord from './component/dashboard/Dashbord';

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashbord />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
