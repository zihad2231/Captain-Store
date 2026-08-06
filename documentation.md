# Captain Store - Project Documentation

## React Concepts Explained

### 1. Where Components are used
In this project, we used **Components** to break the user interface into independent, reusable pieces. 
- **Layout Components**: We created a `Navbar.jsx` and `Footer.jsx` which are used inside `App.jsx` so they appear on every page.
- **Page Components**: Each main view of the application is a component, such as `Home.jsx` (the product catalog), `Login.jsx`, `Cart.jsx`, and `Checkout.jsx`.

### 2. Where Events are used
**Events** are actions triggered by the user (like clicking a button or typing in a text box). We used them throughout the application:
- In `Cart.jsx`, we use the `onClick` event on the "+" and "-" buttons to increase or decrease the quantity of an item.
- In `Navbar.jsx`, we use `onClick` on the "Logout" button to trigger the logout function.
- In `Login.jsx` and `Register.jsx`, we use `onChange` events to read what the user is typing into the input fields.

### 3. Where State is used
**State** is used to store data that changes over time and affects what is shown on the screen.
- **Local State**: In `Home.jsx`, we use `useState` to keep track of the `products` list fetched from the server, the `search` text, and the `loading` status.
- **Global State**: We use React Context (`AuthContext.jsx` and `CartContext.jsx`) to create a global state. For example, the shopping cart items need to be accessible from both the `Cart.jsx` page and the `Navbar.jsx` (to show the cart count).

### 4. Where List Operations are used
**List Operations** (specifically the `.map()` function) are used to dynamically render multiple items from an array onto the screen.
- In `Home.jsx`, we take the `filteredProducts` array and use `.map()` to generate a Bootstrap card for each product.
- In `Cart.jsx`, we use `.map()` to display every item the user has added to their shopping cart.
- In `OrderHistory.jsx`, we use `.map()` to display a list of all past orders.

### 5. Where Form Control is used
We used **Controlled Forms**, meaning React controls the values of the input fields using State.
- In `Checkout.jsx`, the shipping address fields (like Address, City, Postal Code) are controlled. When the user types, the `onChange` event updates the `shippingAddress` state, and the input field's `value` is tied to that state.
- In `Login.jsx` and `Register.jsx`, the email and password inputs are controlled in the exact same way.

---

## Node.js and Express Integration
The backend of this project is built using **Node.js** and **Express.js**. 
- **Node.js** is the runtime that allows us to execute JavaScript on the server.
- **Express.js** is a framework that makes it easy to create an API. 
We integrated them by creating a `server.js` file that sets up an Express application. The Express app listens for incoming HTTP requests (like GET or POST) on specific routes (e.g., `/api/products`). When a request is received, Express routes it to the appropriate controller function (like `getProducts`), which reads data from our JSON files and sends it back to the React frontend.

---

## Request-Response Flows

### Flow 1: User Login
1. **Request**: The user enters their email and password on the frontend `Login.jsx` page and clicks "Log In". React sends an HTTP **POST** request to the backend at `/api/auth/login` containing the credentials in the request body.
2. **Backend Processing**: The Express server routes this to `authController.js`. The controller reads the `users.json` file and searches for a user matching the provided email and password.
3. **Response**: 
   - If a match is found, the server responds with an HTTP **200 OK** status and sends back the user object (without the password).
   - If no match is found, it responds with an HTTP **401 Unauthorized** status and an error message.
4. **Frontend Action**: If successful, React saves the user data in Context and `localStorage`, and redirects the user to the Home page.

### Flow 2: Place Order
1. **Request**: The logged-in user fills out their shipping details on `Checkout.jsx` and clicks "Place Order". React sends an HTTP **POST** request to `/api/orders` with the user ID, cart items, shipping address, and total price.
2. **Backend Processing**: The Express server routes this to `orderController.js`. The controller reads `orders.json`, calculates the new order ID, adds the current date and a "Pending" status, and pushes the new order into the array. It then saves the updated array back to `orders.json`.
3. **Response**: The server responds with an HTTP **201 Created** status and sends back the newly created order data.
4. **Frontend Action**: React clears the shopping cart using the Context API and redirects the user to their Order History page.

---

## How to Run the Project Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed on your computer.

### Step 1: Start the Backend Server
1. Open your terminal and navigate to the backend folder:
   ```bash
   cd "Captain Store/backend"
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the Express server:
   ```bash
   node server.js
   ```
   *The server will run on `http://localhost:5000`.*

### Step 2: Start the Frontend Application
1. Open a **new** terminal window and navigate to the frontend folder:
   ```bash
   cd "Captain Store/frontend"
   ```
2. Install the required dependencies:
   ```bash
   npm install
   ```
3. Start the Vite React development server:
   ```bash
   npm run dev
   ```
   *The frontend will typically run on `http://localhost:5173`. Open this URL in your web browser to view the application.*
