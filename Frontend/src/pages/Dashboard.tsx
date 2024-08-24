// src/Dashboard.tsx
import React, { useState } from 'react';
import { Container, Row, Col, Table, Card, Form, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import CustomNavbar from './components/Navbar';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DashboardProps {
  isLoggedIn: boolean;
  handleLoginLogout: () => void;
}

interface TableData {
  id: number;
  name: string;
  value: number;
}

interface PostData {
  id: number;
  content: string;
  likes: number;
  dislikes: number;
}

const Dashboard: React.FC<DashboardProps> = ({ isLoggedIn, handleLoginLogout }) => {
  const tableData: TableData[] = [
    { id: 1, name: 'Item 1', value: 100 },
    { id: 2, name: 'Item 2', value: 200 },
  ];

  const initialPosts: PostData[] = [
    { id: 1, content: 'This is the first post!', likes: 5, dislikes: 2 },
    { id: 2, content: 'Loving the new dashboard design!', likes: 10, dislikes: 1 },
    { id: 3, content: 'Great work team!', likes: 8, dislikes: 0 },
  ];

  const [posts, setPosts] = useState<PostData[]>(initialPosts);
  const [newPost, setNewPost] = useState<string>('');

  const chartData = {
    labels: ['Price $10', 'Price $20', 'Price $30', 'Price $40', 'Price $50'],
    datasets: [
      {
        label: 'Number of Customers',
        data: [150, 200, 180, 220, 210],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

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
      <CustomNavbar isLoggedIn={isLoggedIn} handleLoginLogout={handleLoginLogout} />
      <Container className="mt-5">
        <Row>
          <Col>
            <Card className="p-3 shadow-sm mb-5">
              <Row>
                <Col md={8}>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Value</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((item) => (
                        <tr key={item.id}>
                          <td>{item.id}</td>
                          <td>{item.name}</td>
                          <td>{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
                <Col md={4}>
                  <Line data={chartData} options={{ responsive: true }} />
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
        <Row className="mt-5">
          <Col md={12}>
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
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Dashboard;
