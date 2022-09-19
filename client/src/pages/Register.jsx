import { gql } from "@apollo/client";
import { useState, useContext } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation} from "@apollo/client";
import {useNavigate} from 'react-router-dom'
import { AuthContext } from "../context/auth";



//  Агар дата базага маълумот жунатетганда  typeDef нечта турдаги поля булса худди ушани узи билан бир хил килиб жунатмасангиз дата сакланмайди ва хато беради
const REGISTER_USER = gql`
  mutation register($email:String!,$username:String!,$password:String!) {
    register(registerInput:{email:$email,username:$username,password:$password}){
      id
      email
      username
      createdAt
      token
    }
  }
`




export const Register = () => {

  const context = useContext(AuthContext)

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

 
  const [errors, setErrors] = useState({})
  const [addUser, { loading }] = useMutation(REGISTER_USER, { 
    variables: {email, username, password},

    update(proxy, result) {            //  update ни ичида react га тегишли булган ишларни функцияларни ишлатсак булади
      //console.log(result)            //  result бу юзер регистрация булгандан кейин сервердан келадиган маълумот
      context.login(result.data.register) //  бу ерда ReduxToolkit ни ишлатсак хам булади                                       
      navigate('/')
    },

    onError(err){                                       //  Back-End дан келган хатони курсатиб беради  агар Back-End да валидация код езилган булса
      //console.log(err.graphQLErrors[0].extensions)    //  Туликрок маълумот беради
      setErrors(err.graphQLErrors[0].message)           //  Кискача маълумот беради
    }
  })



 
  function onSubmit(e) {
    e.preventDefault()  
    addUser()
    setUsername('')
    setEmail('')
    setPassword('')
  }




 
 


  return (
    <div className='form-container'>
      <Form onSubmit={onSubmit} noValidate className={loading ? 'loading': ''}>
        <h1>Register</h1>

        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          error={errors.username ? true : false}
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />

        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        {/* <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          type="password" 
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}     
        /> */}

        <Button type="submit" primary >
          Register
        </Button>

      </Form>
    </div>
  );
};






