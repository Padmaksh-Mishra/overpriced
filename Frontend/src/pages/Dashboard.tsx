import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
  name: string;
  value: number;
}

interface PostData {
  id: number;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  userName: string;
}

const Dashboard: React.FC<DashboardProps> = ({ isLoggedIn, handleLoginLogout }) => {
  const { productId } = useParams<{ productId: string }>();
  const [tableData, setTableData] = useState<TableData[]>([]);
  const [posts, setPosts] = useState<PostData[]>([]);
  const [newPost, setNewPost] = useState<string>('');
  const [chartData, setChartData] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Number of Customers',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  });

  const backendBaseUrl =  'http://localhost:3000';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsResponse = await fetch(`${backendBaseUrl}/api/v1/product/${productId}/fetchprices`);
        const product = await productsResponse.json();

        const tableData: TableData[] = Object.entries(product.aggregatedRequests).map(([price, count]) => ({
          name: `${price}`,
          value: Number(count),
        }));
        setTableData(tableData);

        const postsResponse = await fetch(`${backendBaseUrl}/api/v1/product/${productId}/fetchposts`);
        const postsData = await postsResponse.json();

        const formattedPosts: PostData[] = postsData.posts.map((post: any) => ({
          id: post.id,
          content: post.textContent,
          likes: post.likes,
          dislikes: post.dislikes,
          createdAt: post.createdAt,
          userName: post.user.name,
        }));

        setPosts(formattedPosts);

        // Assuming your chart data handling logic is correct, you can update it here as well

      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [productId]);

  const handleAddPost = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPost.trim()) {
      try {
        const response = await fetch(`/api/v1/product/${productId}/addpost`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ textContent: newPost }),
        });

        if (response.ok) {
          const newPostData: PostData = await response.json();
          setPosts([newPostData, ...posts]);
          setNewPost('');
        }
      } catch (error) {
        console.error('Error adding post:', error);
      }
    }
  };

  const handleLike = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/product/${productId}/like/${id}`, {
        method: 'POST',
      });

      if (response.ok) {
        setPosts(posts.map(post => post.id === id ? { ...post, likes: post.likes + 1 } : post));
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async (id: number) => {
    try {
      const response = await fetch(`/api/v1/product/${productId}/dislike/${id}`, {
        method: 'POST',
      });

      if (response.ok) {
        setPosts(posts.map(post => post.id === id ? { ...post, dislikes: post.dislikes + 1 } : post));
      }
    } catch (error) {
      console.error('Error disliking post:', error);
    }
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
                        <th>Price $</th>
                        <th>Number of People</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tableData.map((item, index) => (
                        <tr key={index}>
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
