# DevTinder – Backend API

    DevTinder is a full-featured backend application that allows developers to:

    - Register & Login securely
    - Send & Review Connection Requests
    - Chat using WebSockets
    - Authenticate using JWT stored in Cookies
    - View Feed with Pagination
    - Secure routes using Middleware
    - Manage Profile & Password



#  Authentication Flow

    - User Signup → Password hashed using bcrypt
    - User Login → JWT token generated
    - JWT stored in Cookies (7 days expiry)
    - Protected routes verified using userAuth middleware
    - Logout clears the cookie


# Models Created

    1. User Model
        - User informstion

    2. ConnectionRequest Model
        - Connection between users

    3. Payment Model
        - Payments made by users for premium feature

    4. Chat Model 
        - chart history between users


# API Endpoints

# AUTH ROUTES (/auth)

    - POST /signup
        - Create new user
        - Validates data
        - Hashes password
        - Saves to DB

    - POST /login
        Login user
        - Validate email & password
        - Compare hashed password
        - Generate JWT
        - Set cookie (7 days expiry)

    - POST /logout
        - Clears JWT cookie

# PROFILE ROUTES (/profile)

    - GET /profile/view
        - Get logged-in user profile
        - Reads JWT from cookie

    - PATCH /profile/edit

        - Update profile fields
        - API level validation
        - Data sanitizing
        - Only allowed fields updated

# CONNECTION REQUEST ROUTES (/request)

    - POST /request/send/:status/:toUserId

            Send connection request
            -Status: ignored or interested
            Validations:
            - Cannot send to self
            - Cannot send duplicate request
            - Cannot send if already connected

    - POST /request/review/:status/:requestId

            Review request
            - Status: accepted or rejected
            Validations:
            - Only receiver can review
            - Request must exist
            - Must be in "interested" state


# payment integration

    - POST /payment/create
    - POST /payment/webhook
    - GET /premium/verify 

    - Third-party API integration ( razorpay )
    - Webhook security
    - Signature validation
    - Payment lifecycle management
    - Order creation flow
    - Server-side premium verification
    - Secure role upgrade logic


# Chat System (Real-Time + Persistent Storage)

    - GET /chat/:targetUserId
        - Reads targetUserId from route params
        - Extracts logged-in user from userAuth
        - Searches for chat

    - Architecture :

        User A ↔ User B
            ↓
        GET /chat/:targetUserId
            ↓
        Find existing chat OR create new chat
            ↓
        Populate sender details
            ↓
        Return conversation history


# WebSocket Integration

    - Real-time chat using Socket.IO
    - Authenticated users can chat
    - Private rooms per connection
