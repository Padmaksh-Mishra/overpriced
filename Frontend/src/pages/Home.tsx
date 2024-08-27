import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, FormControl, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import './Home.css'; // Ensure this path is correct

const backendBaseUrl = 'http://localhost:3000';

// Define the ProductData interface
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
          
          const topDesiredPrice = Math.max(...Object.keys(pricesData.aggregatedRequests).map(Number));
          const difference = product.launchPrice - topDesiredPrice;
          
          return { ...product, topDesiredPrice, difference };
        });
    
        const productDifferenceData = await Promise.all(productDifferences);
    
        // Sort by difference
        productDifferenceData.sort((a, b) => b.difference - a.difference);
    
        // Top 5 most overpriced (highest difference)
        const overpriced = productDifferenceData.slice(0, 5);
    
        // Top 5 most worth it (lowest difference)
        const worthIt = productDifferenceData.slice(-5);

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
    // Optionally handle form submission logic here
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
    return items.map((item) => (
      <Card key={item.id} className="mx-2">
        <Card.Img variant="top" src={`https://via.placeholder.com/150?text=${item.name}`} />
        <Card.Body>
          <Card.Title>{item.name}</Card.Title>
          <Card.Text>
            {`Launch Price: $${item.launchPrice} - Top Desired Price: $${item.topDesiredPrice || 'N/A'}`}
          </Card.Text>
        </Card.Body>
      </Card>
    ));
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
