// src/components/PostSection.tsx
import React, { useState } from 'react';
import { Card, Form, Button } from 'react-bootstrap';

interface PostData {
  id: number;
  content: string;
  likes: number;
  dislikes: number;
}

interface PostSectionProps {
  initialPosts: PostData[];
}

const PostSection: React.FC<PostSectionProps> = ({ initialPosts }) => {
  const [posts, setPosts] = useState<PostData[]>(initialPosts);
  const [newPost, setNewPost] = useState<string>('');

  const handleAddPost = (event: React.FormEvent) => {
    event.preventDefault();
    if (newPost.trim()) {
      const newPostData: PostData = {
        id: posts.length + 1,
        content: newPost,
        likes: 0,
        dislikes: 0,
      };
      setPosts([newPostData, ...posts]);
      setNewPost('');
    }
  };

  const handleLike = (id: number) => {
    setPosts(posts.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));
  };

  const handleDislike = (id: number) => {
    setPosts(posts.map(post => post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post));
  };

  return (
    <>
      <Card>
        <Card.Header>Comments / Posts</Card.Header>
        <Card.Body>
          <Form onSubmit={handleAddPost}>
            <Form.Group controlId="postText">
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Add a post..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Post
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <div className="mt-3">
        {posts.map((post) => (
          <Card key={post.id} className="mb-2">
            <Card.Body>
              <Card.Text>{post.content}</Card.Text>
              <Button variant="success" size="sm" onClick={() => handleLike(post.id)}>
                Like ({post.likes})
              </Button>
              <Button variant="danger" size="sm" onClick={() => handleDislike(post.id)} className="ml-2">
                Dislike ({post.dislikes})
              </Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </>
  );
};

export default PostSection;
