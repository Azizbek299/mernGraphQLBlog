import { Routes, Route, Navigate } from "react-router-dom";
import MenuBar from "./components/MenuBar";
import { Home } from "./pages/Home";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Container } from "semantic-ui-react";
import { AuthProvider } from "./context/auth";
import React, { useContext } from "react";
import { AuthContext } from "./context/auth";
import { Detail } from "./pages/Detail";



function App() {
  const context = useContext(AuthContext);

  return (
    <AuthProvider>
      <Container>
        <MenuBar />

        <Routes>
                      {/* Юзер логин булгандан кейин логин сахифасига утказмайди агар логин булмаган булса Home сахифасига утказмайди */}
        <Route path='/' element={<Home/>}/>
                      {/* Пастдаги кодда шу Navigate to  си логин булган юзерни  <Login/> ва  <Register/> сахифаларига утказмайди  */}
        <Route path='/login' element={!context?.user?.user ? <Login/> : <Navigate to='/'/>}/>     
        <Route path='/register' element={!context?.user?.user ? <Register/> : <Navigate to='/'/>}/>
        <Route path='/post/:postId' element={<Detail/>}/>
        </Routes>
      </Container>
    </AuthProvider>
  );
}

export default App;
