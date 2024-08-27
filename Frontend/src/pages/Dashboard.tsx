import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Row, Col, Table, Card, Form, Button } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

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
  const [requestedPrice, setRequestedPrice] = useState<number | ''>('');
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

  const backendBaseUrl = 'http://localhost:3000';

  const fetchData = async () => {
    try {
      const productsResponse = await fetch(`${backendBaseUrl}/api/v1/product/${productId}/fetchprices`);
      const product = await productsResponse.json();

      // Convert the aggregatedRequests object to an array and sort it by count
      const tableData: TableData[] = Object.entries(product.aggregatedRequests)
        .map(([price, count]) => ({
          name: `${price}`,
          value: Number(count),
        }))
        .sort((a, b) => b.value - a.value); // Sort by the value (count) in descending order

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
      // Sort the data by price for the chart
      const sortedChartData: TableData[] = Object.entries(product.aggregatedRequests)
        .map(([price, count]) => ({
          name: `${price}`,
          value: Number(count),
        }))
        .sort((a, b) => Number(a.name) - Number(b.name)); // Sort by price (name) in ascending order

      // Extract labels (prices) and data (counts) from the sorted chart data
      const chartLabels = sortedChartData.map(item => item.name);
      const chartDataValues = sortedChartData.map(item => item.value);

      // Update the chart data
      setChartData({
        labels: chartLabels,
        datasets: [
          {
            label: 'Number of Customers',
            data: chartDataValues,
            borderColor: 'rgba(75,192,192,1)',
            backgroundColor: 'rgba(75,192,192,0.2)',
            fill: true,
            tension: 0.4,
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [productId]);

  const handleAddPost = async (event: React.FormEvent) => {
    event.preventDefault();
    if (newPost.trim()) {
      try {
        const response = await fetch(`${backendBaseUrl}/api/v1/product/${productId}/addpost`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming you're using token for auth
          },
          body: JSON.stringify({ textContent: newPost }),
        });

        if (response.ok) {
          setNewPost('');
          fetchData(); // Refresh data
        }
      } catch (error) {
        console.error('Error adding post:', error);
      }
    }
  };

  const handleLike = async (id: number) => {
    try {
      const response = await fetch(`${backendBaseUrl}/api/v1/product/${id}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming you're using token for auth
        },
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleDislike = async (id: number) => {
    try {
      const response = await fetch(`${backendBaseUrl}/api/v1/product/${id}/dislike`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming you're using token for auth
        },
      });

      if (response.ok) {
        fetchData(); // Refresh data
      }
    } catch (error) {
      console.error('Error disliking post:', error);
    }
  };

  const handleRequestPrice = async (event: React.FormEvent) => {
    event.preventDefault();
    if (requestedPrice !== '' && requestedPrice > 0) {
      try {
        const response = await fetch(`${backendBaseUrl}/api/v1/product/${productId}/requestprice`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`, // Assuming you're using token for auth
          },
          body: JSON.stringify({ desiredPrice: requestedPrice }),
        });

        if (response.ok) {
          setRequestedPrice('');
          fetchData(); // Refresh data
        }
      } catch (error) {
        console.error('Error requesting price:', error);
      }
    }
  };

  return (
    <>
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
                {isLoggedIn ? (
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
                    <Button variant="primary" type="submit" className="mt-2">
                      Post
                    </Button>
                  </Form>
                ) : (
                  <p>Please sign in to add a post.</p>
                )}
              </Card.Body>
            </Card>
            <div className="mt-3">
              {posts.map((post) => (
                <Card key={post.id} className="mb-2">
                  <Card.Body>
                    <Row>
                      <Col xs={6}>
                        <Card.Text><strong>{post.userName}</strong></Card.Text>
                      </Col>
                      <Col xs={6} className="text-end">
                        <Card.Text>{new Date(post.createdAt).toLocaleDateString()}</Card.Text>
                      </Col>
                    </Row>
                    <Card.Text>{post.content}</Card.Text>
                    <div className="d-flex justify-content-end">
                      <Button variant="success" size="sm" onClick={() => handleLike(post.id)} className="me-2">
                        <FaThumbsUp /> {post.likes}
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDislike(post.id)}>
                        <FaThumbsDown /> {post.dislikes}
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </Col>
        </Row>
        {isLoggedIn && (
          <Row className="mt-5">
            <Col md={12}>
              <Card>
                <Card.Header>Request a Price</Card.Header>
                <Card.Body>
                  <Form onSubmit={handleRequestPrice}>
                    <Form.Group controlId="requestedPrice">
                      <Form.Control
                        type="number"
                        placeholder="Enter desired price"
                        value={requestedPrice}
                        onChange={(e) => setRequestedPrice(Number(e.target.value))}
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="mt-2">
                      Request Price
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </>

  );
};

export default Dashboard;