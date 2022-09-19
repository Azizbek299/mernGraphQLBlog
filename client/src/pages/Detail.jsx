import { gql, useMutation, useQuery } from "@apollo/client";
import React from "react";
import { useState } from "react";
import { useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Card, Form, Grid, Icon, Image, Label } from "semantic-ui-react";
import { DeleteButton } from "../components/DeleteButton";
import { LikeButton } from "../components/LikeButton";
import { AuthContext } from "../context/auth";
import moment from 'moment';

const FETCH_POST_QUERY = gql`
  query ($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likes {
        username
      }
      comments {
        id
        username
        body
        createdAt
      }
      likeCount
      commentCount
    }
  }
`;



const SUBMIT_COMMENT_MUTATION = gql`
  mutation($postId: String!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      comments {
        id
        body
        createdAt
        username
      }
      commentCount
    }
  }
`;





export const Detail = () => {
  const [comment, setComment] = useState('')

  const { user } = useContext(AuthContext);

  const navigate = useNavigate()
  const { postId } = useParams();

  const { data , loading} = useQuery(FETCH_POST_QUERY, { variables: { postId }});      // update езиб унинг ни ичида  react функциялари учун логикалар бажарсангиз хатолик бермайди

  const [submitComment] = useMutation(SUBMIT_COMMENT_MUTATION, {
    variables:{postId, body:comment},
    update(){
      setComment('')
    }
  })

  if (loading) {
    return <p>Loading post ...</p>;
  }

  function deleteButtonCallback() {
    navigate('/')
  }

  return (
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
          <Image
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            size="small"
            float="right"
          />
        </Grid.Column>

        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{data?.getPost?.username}</Card.Header>
              <Card.Meta>{moment(data?.getPost?.createdAt).fromNow()}</Card.Meta>
              <Card.Description>{data?.getPost?.body}</Card.Description>
            </Card.Content>
            <hr />
            <Card.Content extra>
              <LikeButton user={user} post={data?.getPost} />
              <Button
                as="div"
                labelPosition="right"
                onClick={() => console.log("Comment on post")}
              >
                <Button basic color="blue">
                  <Icon name="comments" />
                </Button>
                <Label basic color="blue" pointing="left">
                  {data?.getPost?.commentCount}
                </Label>
              </Button>

              {user && user.username === data?.getPost?.username &&  <DeleteButton  postId={data?.getPost?.id} callback={deleteButtonCallback}/>}
              
            </Card.Content>
          </Card>

          {user && 
            <Card fluid>
              <Card.Content>
              <p>Post a comment</p>
              <Form>
                <div className="ui action input fluid">
                  <input type="text" 
                    placeholder="Comment ..."
                    name="comment"
                    value={comment}
                    onChange={(e)=> setComment(e.target.value)}
                  />
                  <button type="submit" 
                  className='ui button teal'
                  //disabled={comment.trim() === ''}
                  onClick={submitComment}
                  >Submit</button>
                </div>
              </Form>
              </Card.Content>
            </Card>}


          {data?.getPost?.comments.map((comment)=> {
            return(
              <Card fluid key={comment.id}>
                  <Card.Content>
                    {user && user.username === comment.username && <DeleteButton postId={data?.getPost?.id} commentId={comment.id}/>}
                    <Card.Header>{comment.username}</Card.Header>
                    <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                    <Card.Description>{comment.body}</Card.Description>
                  </Card.Content>
              </Card>
            )
          })}


        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};
