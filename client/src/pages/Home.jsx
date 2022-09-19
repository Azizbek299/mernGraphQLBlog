import React, {useContext} from "react";
import { gql, useQuery } from "@apollo/client";
import { Grid, TransitionGroup } from "semantic-ui-react";
import { PostCard } from "../components/PostCard";
import { AuthContext } from "../context/auth";
import { PostForm } from "../components/PostForm";
import { Footer } from "../components/Footer";

const FETCH_POSTS_QUERY = gql`
  query {
    getPosts {
      id
      body
      createdAt
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

export const Home = () => {
  const { loading,data } = useQuery(FETCH_POSTS_QUERY);
  const context = useContext(AuthContext)

  
  return (
    <div>
      <Grid columns={3}>
        <Grid.Row className='page-title'>
          <h1>Recent Post</h1>
        </Grid.Row>
        <Grid.Row>

        {context.user && (
          <Grid.Column>
            <PostForm/>
          </Grid.Column>
        )}

        {loading 
        ? 
        (<h1>Loading ...</h1>) 
        : 
        (
          <TransitionGroup>
            {data?.getPosts?.map((post) => {
              return(
                <Grid.Column key={post.id}>
                  <PostCard post={post} />
                </Grid.Column>
          )
          })}
          </TransitionGroup>
        )
        }
        </Grid.Row>
      </Grid>
      <Footer/>
    </div>
  );
};
