import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from '@apollo/client/link/context';
import { BrowserRouter } from "react-router-dom";


const httpLink = createHttpLink({
  uri: process.env.REACT_APP_API_URL,
});


const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('jwtToken');       // get the authentication token from local storage if it exists
                                                        //  jwtToken  деб номланишига сабаб биз уни context/auth.js ни ичида белгилаганмиз
  return {                                              // return the headers to the context so httpLink can read them
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});



const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});




const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
 
    <BrowserRouter>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </BrowserRouter>

);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
