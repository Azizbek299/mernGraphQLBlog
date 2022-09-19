import React, { useReducer, createContext } from 'react';
import jwtDecode from 'jwt-decode';




const initialState = {
  user: null
};

if (localStorage.getItem('jwtToken')) {
  const decodedToken = jwtDecode(localStorage.getItem('jwtToken'));

  if (decodedToken.exp * 1000 < Date.now()) {
    localStorage.removeItem('jwtToken');
  } else {
    initialState.user = decodedToken;
  }
}



const AuthContext = createContext({
  user: initialState, 

  login: (userData) => {            // Бу ер заранее брон килинадиган полялар , бу полялар учун функциялар логика пастда  AuthProvider да бажарилади
  },

  logout: () => {}

});

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        
      };
    case 'LOGOUT':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  function login(userData) {
    localStorage.setItem('jwtToken', userData.token);

    dispatch({
      type: 'LOGIN',
      payload: userData, 
    });

    if(userData){
      window.location.href='/'
    }

  }

  function logout() {
    localStorage.removeItem('jwtToken');
    dispatch({ type: 'LOGOUT'});
    window.location.reload();
  }

  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}

export { AuthContext, AuthProvider };


