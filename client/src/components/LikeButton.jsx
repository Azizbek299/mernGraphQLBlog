import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Button } from "semantic-ui-react";
import {gql, useMutation} from '@apollo/client'



const LIKE_POST_MUTATION = gql`
  mutation likePost($postId:ID!){
    likePost(postId:$postId){
      id
      likes {
        id
        username
      }
    }
  }
`

const FETCH_POSTS_QUERY = gql`
  query {
    getPosts {
      id
      body
      username
      likeCount
      likes {
        id
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







export const LikeButton = (props) => {        //  Отаси PostCard.jsx

  const [liked, setLiked] = useState(false);

  useEffect(() => {         // user логин булган булса ва like куйган еки куймаганми аниклаяпти
    if (
      props.user &&
      props.post.likes.find((like) => like.username === props.user.username)
    ) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [props.user, props.post.likes]);


  const [likePost] = useMutation(LIKE_POST_MUTATION, {
    variables:{postId:props.post.id},                      // Кайси постга like босяпмиз (post ни id сини саклаб куямиз)
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],	        // шу кодни пастига update езиб унинг ичида  react функциялари учун логикалар бажарсангиз хатолик бермайди
  })

   
  return (
    <>
      <Button
        style={{ marginRight: "10px" }}
        onClick={likePost}
        as='div'
        basic={props.user && liked ? false : true }
        color="teal"
        icon="heart"
        content="Like"
        label={{
          basic: true,
          color: "teal",
          pointing: "left",
          content: `${props.post.likeCount}`,
        }}
      />
    </>
  );
};
