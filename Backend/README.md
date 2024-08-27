## Routes
### User
- signin = /api/v1/user/signin
    - email,password,name
    - user object
- signup = /api/v1/user/signup
    - email,password
    - token

### Product
- add product = /api/v1/product/addproduct
    - name
    - id
- request price = /api/v1/product/:productId/requestprice
    - auth ?
    - desiredPrice
    - Null
- add post = /api/v1/product/:productId/addpost
    - auth ?
    - textContent
    - Null
- like/dislike = /api/v1/product/:productId/like
    - auth ?
    - Null
    - Null
- fetch prices = /api/v1/product/:productId/fetchprices
    - Null
    - {productId,productName,aggregatedRequests}
- fetch posts = /api/v1/product/:productId/fetchposts
    - Null
    - Posts sorted by likes (can add creation date as well)
- search products = /api/v1/product/search?query=sometinganything
    - Null
    - product objects

### Note
- sort by creation date can be added 
- a single user can do many likes and dislikes (for now)
- a single user can have only one requested price per product (can update it)
- a single user can do multiple posts for a paticular product
- any one can add a new product (for now)