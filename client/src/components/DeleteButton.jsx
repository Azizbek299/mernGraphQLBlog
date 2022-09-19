import { gql, useMutation } from "@apollo/client";
import { useState } from "react";
import { Button, Icon, Confirm } from "semantic-ui-react";


const DELETE_POST_MUTATION = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;


const DELETE_COMMENT_MUTATION = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      comments {
        id
        username
        body
      }
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



export const DeleteButton = (props) => {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const postId = props.postId;
  const commentId = props.commentId


  const mutation = commentId ? DELETE_COMMENT_MUTATION : DELETE_POST_MUTATION   // Логика кимни учириш кераклигини келаетган датага караб белгилайди

  const [deletePostOrComment] = useMutation(mutation, {
    variables: { postId, commentId },
    refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    update(){                        // update ни ичида  react функциялари учун логикалар бажарсангиз хатолик бермайди 
        setConfirmOpen(false)
        if(props.callback){
          return props.callback()           // Post ни учираетганда ишга тушадиган код  Ота сидаги кодни ишга тушуради
        }
    }
  });

  return (
    <>
      <Button
        as="div"
        color="red"
        style={{ padding: "5px 2px 8px 5px", marginLeft: "5px" }}
        floated="right"
        onClick={()=> setConfirmOpen(true)}
        >

        <Icon name="trash" style={{ padding: "5px 2px 5px 5px" }} />

      </Button>

      <Confirm
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={deletePostOrComment}
      />
    </>
  );
};
