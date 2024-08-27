import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, FormControl, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaDollarSign } from 'react-icons/fa';
import './Home.css'; // Ensure this path is correct

const backendBaseUrl = 'http://localhost:3000';

interface ProductData {
  id: number;
  name: string;
  launchPrice: number;
  topDesiredPrice?: number;
}

const Home: React.FC = () => {
  const [worthItItems, setWorthItItems] = useState<ProductData[]>([]);
  const [mostOverpricedItems, setMostOverpricedItems] = useState<ProductData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ProductData[]>([]);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${backendBaseUrl}/api/v1/product/all`);
        const products = await response.json();

        const productDifferences = products.map(async (product: ProductData) => {
          const pricesResponse = await fetch(`${backendBaseUrl}/api/v1/product/${product.id}/fetchprices`);
          const pricesData = await pricesResponse.json();

          // Convert the aggregatedRequests object to an array of prices
          const pricesArray = Object.entries(pricesData.aggregatedRequests)
            .map(([price, _count]) => parseFloat(price)); // Convert keys to numbers

          // Find the maximum price or default to 0 if pricesArray is empty
          const topDesiredPrice = pricesArray.reduce((max, current) => (current > max ? current : max), 0);

          const difference = product.launchPrice - topDesiredPrice;

          return { ...product, topDesiredPrice, difference };
        });

        const productDifferenceData = await Promise.all(productDifferences);

        productDifferenceData.sort((a, b) => b.difference - a.difference);

        const overpriced = productDifferenceData.slice(0, 4);
        const worthIt = productDifferenceData.slice(-4);

        setWorthItItems(worthIt);
        setMostOverpricedItems(overpriced);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };


    fetchProducts();
  }, []);

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value) {
      try {
        const response = await fetch(`${backendBaseUrl}/api/v1/product/search?query=${value}`);
        const result = await response.json();
        const products = result.products || [];
        setSearchResults(Array.isArray(products) ? products : []);
        setDropdownVisible(true);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setSearchResults([]);
        setDropdownVisible(false);
      }
    } else {
      setSearchResults([]);
      setDropdownVisible(false);
    }
  };

  const handleSelectProduct = (productId: number) => {
    navigate(`product/${productId}/dashboard`);
    setDropdownVisible(false);
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  const handleAddProductClick = () => {
    navigate('/addproduct'); // Replace with the actual route for adding a product
  };

  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
      slidesToSlide: 1,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
      slidesToSlide: 1,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1,
    },
  };

  const renderCarouselItems = (items: ProductData[]) => {
    const navigate = useNavigate(); // Initialize navigate

    const handleCardClick = (productId: number) => {
      navigate(`/product/${productId}/dashboard`);
    };

    return items.map((item) => {
      const topDesiredPrice = item.topDesiredPrice ?? 0;
      const percentageDifference = ((item.launchPrice - topDesiredPrice) / item.launchPrice) * 100;
      const isBelow20Percent = percentageDifference >= 30; // Changed to 30% based on your requirement
      const cardBgColor = isBelow20Percent ? '#f2dede' : '#dff0d8'; // Light red or green shades

      return (
        <Card
          key={item.id}
          className="mx-2 my-3 shadow-sm border-light"
          style={{ borderRadius: '10px', overflow: 'hidden', backgroundColor: cardBgColor }}
          onClick={() => handleCardClick(item.id)}
          role="button"
        >
          {/* Optionally add an image */}
          {/* <Card.Img
            variant="top"
            src={`https://via.placeholder.com/150?text=${item.name}`}
            alt={item.name}
          /> */}
          <Card.Body className="text-center">
            <Card.Title className="mb-3">{item.name}</Card.Title>
            <Card.Text>
              <div className="d-flex flex-column align-items-center">
                <div className="mb-2">
                  <FaDollarSign /> <strong>Launch Price:</strong> ${item.launchPrice}
                </div>
                <div>
                  <FaDollarSign /> <strong>Top Desired Price:</strong> ${topDesiredPrice}
                </div>
                <div
                  className="mt-2"
                  style={{ color: isBelow20Percent ? '#a94442' : '#3c763d' }} // Text color based on percentage
                >
                  {percentageDifference.toFixed(2)}% less than Launch Price
                </div>
              </div>
            </Card.Text>
          </Card.Body>
        </Card>
      );
    });
  };

  return (
    <>
      <Container className="mt-5" style={{ marginBottom: '7%' }}>
        <Row className="justify-content-center mb-4">
          <Col md={8} className="search-container">
            <Form onSubmit={handleFormSubmit}>
              <FormControl
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchTerm}
                onChange={handleSearch}
                onFocus={() => setDropdownVisible(true)}
                onBlur={() => setTimeout(() => setDropdownVisible(false), 100)}
              />
              {dropdownVisible && searchResults.length > 0 && (
                <ul className="search-dropdown">
                  {searchResults.map((product) => (
                    <li
                      key={product.id}
                      onClick={() => handleSelectProduct(product.id)}
                      className="search-result-item"
                    >
                      {product.name}
                    </li>
                  ))}
                </ul>
              )}
            </Form>
          </Col>
        </Row>
        <Row className="justify-content-center mb-4">
          <Col md={8} className="text-center">
            <Button variant="primary" onClick={handleAddProductClick}>
              Add Product
            </Button>
          </Col>
        </Row>
        <Row style={{ marginBottom: '5%', marginLeft: '5%' }}>
          <Col md={11}>
            <h3>Worth it</h3>
            <Carousel responsive={responsive} infinite={true} arrows={true}>
              {renderCarouselItems(worthItItems)}
            </Carousel>
          </Col>
        </Row>
        <Row className="mt-4" style={{ marginLeft: '5%' }}>
          <Col md={11}>
            <h3>Most Overpriced</h3>
            <Carousel responsive={responsive} infinite={true} arrows={true}>
              {renderCarouselItems(mostOverpricedItems)}
            </Carousel>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Home;
