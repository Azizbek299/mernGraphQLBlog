import React, { useContext } from "react";
import { Button, Card, Image } from "semantic-ui-react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/auth";
import { LikeButton } from "./LikeButton";
import { DeleteButton } from "./DeleteButton";
import moment from 'moment';

export const PostCard = (props) => {        //  Отаси Home.jsx

  const { user } = useContext(AuthContext);

  return (
    <Card fluid style={{ marginBottom: "20px" }}>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />

        <Card.Header>{props.post.username}</Card.Header>

        <Card.Meta as={Link} to={`/post/${props.post.id}`}>
        {moment(props.post.createdAt).fromNow(true)}
        </Card.Meta>

        <Card.Description>{props.post.body}</Card.Description>
      </Card.Content>


      <Card.Content extra>

        <LikeButton post={props.post} user={user} />

        <Button
          as={Link}
          to={`/post/${props.post.id}`}
          basic
          color="teal"
          content="Comment"
          icon="comments"
          label={{
            basic: true,
            color: "teal",
            pointing: "left",
            content: `${props.post.commentCount}`,
          }}

        />
        {user && user.username === props.post.username &&  <DeleteButton  postId={props.post.id}/>}
      </Card.Content>
    </Card>
  );
};
