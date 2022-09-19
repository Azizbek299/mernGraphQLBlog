import { gql } from "@apollo/client";
import { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation} from "@apollo/client";
//import {useNavigate} from 'react-router-dom'
import { AuthContext } from "../context/auth";


//  Агар дата базага маълумот жунатетганда  typeDef нечта турдаги поля булса худди ушани узи билан бир хил килиб жунатмасангиз дата сакланмайди ва хато беради
const LOGIN_USER = gql`                                     #   Функция номи хохлаганизни куйсангиз булади
  mutation login($username:String!,$password:String!) {     #   Функция номи хохлаганизни куйсангиз булади
    login(username:$username,password:$password){           #   Функция номи хохлаганизни куйиб булмайди
      id
      email
      username
      token
    }
  }
`




export const Login = () => {
  
  const context = useContext(AuthContext)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  // eslint-disable-next-line
  const [errors, setErrors] = useState({})
  const [loginUser, { loading }] = useMutation(LOGIN_USER, { 
    variables: {username, password},

    update(proxy, result) {               //  update ни ичида react га тегишли булган ишларни функцияларни ишлатсак булади
                                            // update ни ичида  react функциялари учун логикалар бажарсангиз хатолик бермайди
      //console.log(result)               //  result бу юзер регистрация булгандан кейин сервердан келадиган маълумот
      context.login(result.data.login)    // маълумотни context га беряпмиз еки бунинг урнига ReduxToolkit ни ишлатсак хам булади
      //navigate('/')
    },

    onError(err){                                       //  Back-End дан келган хатони курсатиб беради  агар Back-End да валидация код езилган булса
      //console.log(err.graphQLErrors[0].extensions)    //  Туликрок маълумот беради
      setErrors(err.graphQLErrors[0].message)           //  Кискача маълумот беради
    }
  })


 
  function onSubmit(e) {
    e.preventDefault()  
    loginUser()
    setUsername('')
    setPassword('')
  }

  

  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
        <h1>Login</h1>

        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

     
        <Button type="submit" primary >
          Login
        </Button>

      </Form>
      
    </div>
  );
};






