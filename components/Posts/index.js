import React, { useEffect, useState } from 'react';
import styled from '@emotion/styled';
import axios from 'axios';
import Post from './Post';
import Container from '../common/Container';
import useWindowWidth from '../hooks/useWindowWidth';

const CarouselContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 100%;
  overflow: hidden;
`;

const PostListContainer = styled.div`
  display: flex;
  flex-wrap: wrap; 
  justify-content: center; /* Center posts horizontally */
`;

const LoadMoreButton = styled.button`
  margin-top: 10px;
  margin-bottom: 20px; 
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
`;

const ShowMoreButton = styled.button`
  margin-top: 10px;
  margin-bottom: 20px; /* Adjust margin as needed */
  padding: 10px 20px;
  background-color: #28a745; 
  color: white;
  border: none;
  cursor: pointer;
  border-radius:1.5rem;
`;

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visiblePosts, setVisiblePosts] = useState(6); 
  const [hasMorePosts, setHasMorePosts] = useState(true); 
  const { isSmallerDevice } = useWindowWidth();

  useEffect(() => {
    fetchPostsData();
  }, [isSmallerDevice]);

  const fetchPostsData = async () => {
    try {
      const { data: initialPostsData } = await axios.get('/api/v1/posts');
      const { data: usersData } = await axios.get('https://jsonplaceholder.typicode.com/users');

      // Combine post data with user data
      const postsWithUsers = initialPostsData.map(post => ({
        ...post,
        user: usersData.find(user => user.id === post.userId)
      }));

      setPosts(postsWithUsers);
    } catch (error) {
      console.error('Error fetching posts or users:', error);
    }
  };

  const handlePrevClick = () => {
    setCurrentIndex(currentIndex => Math.max(currentIndex - 1, 0));
  };

  const handleNextClick = () => {
    setCurrentIndex(currentIndex => Math.min(currentIndex + 1, posts.length - 1));
  };

  const handleShowMore = () => {
    setVisiblePosts(posts.length);
    setHasMorePosts(false); 
  };

  return (
    <Container>
      <CarouselContainer>
        <PostListContainer>
          {posts.slice(0, visiblePosts).map(post => (
            <Post key={post.id} post={post} />
          ))}
        </PostListContainer>
      </CarouselContainer>
      {hasMorePosts && (
        <ShowMoreButton onClick={handleShowMore}>
          Show More
        </ShowMoreButton>
      )}
    </Container>
  );
}