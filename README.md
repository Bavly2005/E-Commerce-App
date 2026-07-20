# E-Commerce App

A RESTful e-commerce backend API built with Node.js, Express, and MongoDB. It provides the core services needed to power an online store — authentication, product/catalog data, image uploads, and Stripe-powered payments — with a security-hardened Express setup.

## Tech Stack

- **Runtime:** Node.js (ES Modules)
- **Framework:** Express 5
- **Database:** MongoDB with Mongoose
- **Authentication:** JSON Web Tokens (JWT) + bcrypt password hashing
- **Payments:** Stripe
- **File Uploads:** Multer + Sharp (image processing)
- **Email:** Nodemailer
- **Validation:** express-validator
- **Security:** express-mongo-sanitize, xss-clean, hpp, cors, express-rate-limit
- **Logging:** morgan
- **Linting/Formatting:** ESLint (Airbnb config) + Prettier

## Project Structure

```
E-Commerce-App/
├── config/         # App configuration (env, database connection, etc.)
├── middlewares/     # Custom Express middleware (auth, error handling, validation, etc.)
├── models/          # Mongoose schemas/models
├── routes/          # API route definitions
├── services/         # Business logic / service layer
├── uploads/          # Uploaded media files
├── utils/            # Helper/utility functions
├── server.js         # Application entry point
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (LTS recommended)
- MongoDB instance (local or Atlas)
- Stripe account (for payment functionality)

### Installation

```bash
git clone https://github.com/Bavly2005/E-Commerce-App.git
cd E-Commerce-App
npm install
```

### Environment Variables

Create a `.env` file in the project root with the values your setup requires, for example:

```env
NODE_ENV=development
PORT=5000
DATABASE_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=90d
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_HOST=your_smtp_host
EMAIL_PORT=your_smtp_port
EMAIL_USER=your_smtp_username
EMAIL_PASSWORD=your_smtp_password
```

> Adjust the variable names to match what's referenced in `config/` and `services/`.

### Running the App

```bash
# Development (with nodemon, auto-restarts on changes)
npm run start:dev

# Production
npm run start:prod
```

The API will start on the port specified in your environment configuration.

## Features

- User authentication and authorization with JWT
- Password hashing with bcrypt
- Product/catalog management via Mongoose models
- Image upload and processing (Multer + Sharp)
- Stripe integration for checkout/payments
- Transactional emails via Nodemailer
- Input validation with express-validator
- Hardened API security: NoSQL injection sanitization, XSS protection, HTTP parameter pollution prevention, CORS, and rate limiting
- Request logging with morgan
- Response compression

## Scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Runs the server with nodemon for local development |
| `npm run start:prod` | Runs the server in production mode |

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to open an issue or submit a pull request.

## License

This project is licensed under the ISC License.
