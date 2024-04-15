import React from 'react'
import { AuthProvider } from './context/AuthContext';
import Homepage from './views/Homepage'
import Loginpage from './views/Loginpage';
import RegisterPage from './views/Registerpage';
import PasswordResetRequestForm from './views/PasswordResetRequestForm';
import PasswordResetConfirmationForm from './views/PasswordResetRequestForm';
import Message from './views/Message';
import MessageDetail from './views/MessageDetail';
import SearchUsers from './views/SearchUsers';
import ProfileForm from './views/ProfileForm';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path='/login' element={<Loginpage/>} />
        <Route path='/register' element={<RegisterPage/>} />
        <Route path='/password' element={<PasswordResetRequestForm />}/>
        <Route path='/password-reset' element={<PasswordResetConfirmationForm/>} />
        <Route  path="/msg" element={<Message />} />
        <Route path='/inbox/:id' element={<MessageDetail />} />
        <Route path='/search/:username' element={<SearchUsers />} />
        <Route path='/profile' element={<ProfileForm />} />
         
      </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;