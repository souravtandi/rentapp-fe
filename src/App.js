import './App.css';
import NavBar from './components/NavBar';
import Login from './screens/Login';
import Register from './screens/Register';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './screens/Home';
import Profile from './screens/Profile';
import MyProperty from './screens/MyProperty';
import AddProperty from './screens/AddProperty';
import AllProperties from './screens/AllProperties';
import {useSelector} from 'react-redux'
import PropertyDetails from './screens/PropertyDetails';
import EditUser from './screens/EditUser';
import Footer from './components/Footer';

function App() {

  const user = useSelector(state => state.user)

  return (
    <Router>
      <div className='appbackground'>
        <NavBar />
        <Routes>
          <Route exact path='/' element={<Home />}></Route>
          <Route exact path='/login' element={<Login />}></Route>
          <Route exact path='/register' element={<Register />}></Route>
          {user.user.fname ?<Route exact path='/user/profile/:type/:userId' element={<EditUser />}></Route> : ""}
          <Route exact path='/allProperties' element={<AllProperties />}></Route>
          <Route exact path='/propertyDetails/:propertyId' element={<PropertyDetails />}></Route>
          {user.user.fname ?<Route exact path='/properties' element={<MyProperty />}></Route> : ""}
          {user.user.fname ?<Route exact path='/addProperty' element={<AddProperty />}></Route> : ""}
          {user.user.fname ?<Route exact path='/editProperty/:propertyId' element={<AddProperty />}></Route> : ""}
          {user.user.fname ?<Route exact path='/userProfile' element={<Profile />}></Route> : ""}
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
