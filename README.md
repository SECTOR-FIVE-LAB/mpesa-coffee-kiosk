
A modern coffee ordering kiosk with M-Pesa payment integration, built with React, TypeScript, and Node.js.

## 🚀 Features

- **Modern UI/UX**: Beautiful, responsive interface built with React, TypeScript, and Tailwind CSS
- **M-Pesa Integration**: Seamless payment processing using Safaricom's M-Pesa API
- **User Authentication**: Secure login system with JWT tokens
- **Order Management**: Track and manage coffee orders
- **Admin Panel**: Administrative interface for order management
- **Real-time Updates**: Live order status updates
- **Mobile Responsive**: Optimized for all device sizes

## 🏗️ Project Structure

```
coffee-and-code/
├── client/                 # React frontend application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── data/          # Static data (coffee products)
│   │   ├── lib/           # Utility functions and API
│   │   └── hooks/         # Custom React hooks
│   └── package.json
├── Backend/               # Node.js backend server
│   ├── routes/           # API route handlers
│   ├── middleware/       # Express middleware
│   ├── utils/           # Utility functions
│   └── index.js         # Main server file
├── index.js              # M-Pesa STK Push API service
└── package.json
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Shadcn/ui** for UI components
- **React Router** for navigation
- **React Query** for data fetching
- **Axios** for HTTP requests

### Backend
- **Node.js** with Express
- **MongoDB** with Mongoose for data persistence
- **JWT** for authentication
- **bcrypt** for password hashing
- **M-Pesa API** integration

## 📋 Prerequisites

Before running this project, make sure you have:

- **Node.js** (v16 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** (local installation or MongoDB Atlas)
- **M-Pesa Developer Account** with sandbox credentials

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd coffee-and-code
```

### 2. Install Dependencies

```bash
# Install root dependencies
npm install

# Install frontend dependencies
cd client
npm install

# Install backend dependencies
cd ../Backend
npm install
```

### 3. Environment Configuration

Create the following environment files:

#### Root `.env` file (for M-Pesa STK Push service)
```env
CONSUMER_KEY=your_mpesa_consumer_key
CONSUMER_SECRET=your_mpesa_consumer_secret
PAYBILL=your_paybill_number
PASSKEY=your_passkey
CALLBACK_URL=https://your-domain.com/callback
PORT=3000
```

#### Backend `.env` file
```env
MONGODB_URI=mongodb://localhost:27017/coffee-kiosk
JWT_SECRET=your_jwt_secret_key
CONSUMER_KEY=your_mpesa_consumer_key
CONSUMER_SECRET=your_mpesa_consumer_secret
PAYBILL=your_paybill_number
PASSKEY=your_passkey
PORT=3001
```

#### Frontend `.env` file (in client directory)
```env
VITE_API_URL=http://localhost:3001
VITE_MPESA_API_URL=http://localhost:3000
```

### 4. M-Pesa Configuration

1. **Get M-Pesa Credentials**:
   - Sign up for M-Pesa Developer Account at [Safaricom Developer Portal](https://developer.safaricom.co.ke/)
   - Create a new app and get your Consumer Key and Consumer Secret
   - Set up your Paybill number and Passkey

2. **Configure Callback URL**:
   - For development, use [ngrok](https://ngrok.com/) to expose your local server
   - Run: `ngrok http 3000` to get a public URL
   - Use the ngrok URL as your callback URL in the environment variables

### 5. Database Setup

Make sure MongoDB is running:

```bash
# Start MongoDB (if installed locally)
mongod

# Or use MongoDB Atlas (cloud service)
# Update MONGODB_URI in Backend/.env with your Atlas connection string
```

## 🚀 Running the Application

### Development Mode

1. **Start the M-Pesa STK Push service** (root directory):
```bash
npm run dev
```

2. **Start the Backend server**:
```bash
cd Backend
npm run dev
```

3. **Start the Frontend application**:
```bash
cd client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- M-Pesa Service: http://localhost:3000

### Production Build

1. **Build the frontend**:
```bash
cd client
npm run build
```

2. **Start production servers**:
```bash
# Start M-Pesa service
npm start

# Start backend (in Backend directory)
npm start
```

## 📱 Usage

### For Customers

1. **Browse Coffee Selection**: View available coffee products with prices
2. **Select Product**: Click on any coffee to view details
3. **Make Payment**: Enter your M-Pesa phone number and confirm payment
4. **Track Orders**: View your order history in the "My Orders" section

### For Administrators

1. **Login**: Use admin credentials to access the admin panel
2. **View Orders**: Monitor all incoming orders in real-time
3. **Manage Orders**: Update order status and track payments
4. **Analytics**: View sales data and customer insights

## 🔐 Authentication

### Default Admin Account
- Username: `admin`
- Password: `admin123`

**Important**: Change the default admin password in production!

### User Registration
- Users can register with any username
- Passwords are securely hashed using bcrypt
- JWT tokens are used for session management

## 💳 M-Pesa Integration

The application integrates with M-Pesa's STK Push API for seamless payments:

- **STK Push**: Initiates payment requests to customer's phone
- **Callback Handling**: Processes payment confirmations
- **Receipt Generation**: Creates transaction receipts
- **Error Handling**: Manages failed payments gracefully

### Payment Flow
1. Customer selects coffee and enters phone number
2. System initiates STK Push to customer's phone
3. Customer receives M-Pesa prompt on their phone
4. Customer enters M-Pesa PIN to complete payment
5. System receives callback with payment confirmation
6. Order is created and customer receives confirmation

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **CORS Protection**: Configured for secure cross-origin requests
- **Input Validation**: Server-side validation for all inputs
- **Error Handling**: Comprehensive error handling and logging

## 🧪 Testing

### API Testing
Test the M-Pesa integration endpoints:

```bash
# Test payment initiation
curl -X POST http://localhost:3000/pay \
  -H "Content-Type: application/json" \
  -d '{"phone":"254700000000","amount":100}'

# Test health check
curl http://localhost:3000/health
```

### Frontend Testing
```bash
cd client
npm run lint
```

## 🚀 Deployment

### Render Deployment (Recommended)

The easiest way to deploy your coffee kiosk is using Render's Blueprint deployment:

1. **Fork/Clone Repository**: Ensure your repository is on GitHub
2. **Connect to Render**: 
   - Go to [Render Dashboard](https://dashboard.render.com/)
   - Click "New +" → "Blueprint"
   - Connect your GitHub repository
   - Select the `main` branch
   - Click "Apply"

3. **Configure Environment Variables**:
   - After deployment, go to each service in Render Dashboard
   - Add your M-Pesa credentials:
     - `CONSUMER_KEY`
     - `CONSUMER_SECRET` 
     - `PAYBILL`
     - `PASSKEY`

4. **Update Database Connection**:
   - The MongoDB database will be automatically created
   - Update the `MONGODB_URI` in the backend service with the provided connection string

5. **Access Your Application**:
   - Frontend: `https://coffee-kiosk-frontend.onrender.com`
   - Backend: `https://coffee-kiosk-backend.onrender.com`
   - M-Pesa Service: `https://coffee-kiosk-mpesa.onrender.com`

### Render Configuration

The `render.yaml` file defines three services and one database:

#### Services:
1. **coffee-kiosk-frontend**: React application built with Vite
2. **coffee-kiosk-backend**: Node.js API server with MongoDB
3. **coffee-kiosk-mpesa**: M-Pesa STK Push service

#### Database:
- **coffee-kiosk-db**: MongoDB database for storing users and orders

#### Environment Variables:
- **Frontend**: Points to backend and M-Pesa service URLs
- **Backend**: Database connection, JWT secret, and M-Pesa credentials
- **M-Pesa Service**: M-Pesa API credentials and callback URL

### Manual Deployment

#### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

#### Backend Deployment
1. Set up a Node.js server (Heroku, DigitalOcean, AWS, etc.)
2. Configure environment variables
3. Set up MongoDB database
4. Deploy the Backend folder

#### M-Pesa Service Deployment
1. Deploy the root `index.js` file
2. Configure environment variables
3. Set up proper callback URLs for production

## 📝 Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `CONSUMER_KEY` | M-Pesa API Consumer Key | Yes |
| `CONSUMER_SECRET` | M-Pesa API Consumer Secret | Yes |
| `PAYBILL` | M-Pesa Paybill Number | Yes |
| `PASSKEY` | M-Pesa API Passkey | Yes |
| `CALLBACK_URL` | Payment callback URL | Yes |
| `MONGODB_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | JWT signing secret | Yes |
| `PORT` | Server port (default: 3000) | No |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:

1. Check the console logs for error messages
2. Verify all environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Verify M-Pesa credentials are correct
5. Check network connectivity for API calls

## 🔄 Updates

- **v1.0.0**: Initial release with basic M-Pesa integration
- **v1.1.0**: Added admin panel and order management
- **v1.2.0**: Enhanced UI/UX and mobile responsiveness

---

**Note**: This application uses M-Pesa's sandbox environment for testing. For production use, switch to the live M-Pesa API endpoints and credentials.
