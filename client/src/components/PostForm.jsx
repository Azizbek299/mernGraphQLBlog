import { gql } from "@apollo/client";
import React from "react";
import { useState } from "react";
import { Button, Form } from "semantic-ui-react";
import { useMutation} from "@apollo/client";




const CREATE_POST = gql`
  mutation createPost($body:String!) {
    createPost( body:$body ) {
      id
      body
      createdAt
      username
      comments {id body username createdAt}
      likes {id username createdAt}
      likeCount
      commentCount
    }
  }
`;

const FETCH_POSTS_QUERY = gql`
  query {
    getPosts {
      id
      body
      username
      likeCount
      likes {
        username
      }
      commentCount
      comments {
        id
        username
        body
      }
    }
  }
`;




export const PostForm = () => {

  // eslint-disable-next-line
  const [errors, setErrors] = useState({})
  const [body, setBody] = useState("");

   // eslint-disable-next-line
  const [createPost, { loading, error }] = useMutation(CREATE_POST, {   //  createPost  бу сервердаги resolver.js файлидаги функция номи постларни тузиш билан шугуланадиган
    variables: {body},

    update(cache, {data:{createPost}}) {            //  update ни ичида react га тегишли булган ишларни функцияларни ишлатсак булади
      //console.log(result)              //  result бу юзер регистрация булгандан кейин сервердан келадиган маълумот
                                       //  бу ерда ReduxToolkit ни ишлатсак хам булади пастдаги кодларни урнига                                              
      const {getPosts} = cache.readQuery({query:FETCH_POSTS_QUERY})         //  getPosts  бу сервердаги resolver.js файлидаги функция номи постлар укиш билан шугуланадиган
      cache.writeQuery({
        query:FETCH_POSTS_QUERY,
        data:{getPosts:[...getPosts, createPost]}
      })
    
    },

    onError(err){                                       //  Back-End дан келган хатони курсатиб беради  агар Back-End да валидация код езилган булса
      //console.log(err.graphQLErrors[0].extensions)    //  Туликрок маълумот беради
      setErrors(err.graphQLErrors[0].message)           //  Кискача маълумот беради
    }
  })

  function onSubmit(e) {
    e.preventDefault()
    createPost()
    setBody('')

  }

  return (
    <Form onSubmit={onSubmit}>
      <h2>Create a post</h2>
      <Form.Field>
        <Form.Input
          placeholder="Hi Post"
          type="text"
          name="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
        <Button type="submit" color="teal">
          Submit
        </Button>
      </Form.Field>
    </Form>
  );
};
