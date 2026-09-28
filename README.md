# 🛒 EasyMart – Full Stack Grocery Store

**React (Vite + Tailwind) + Express + MongoDB (Mongoose) + JWT Auth + Stripe Payments**

```
EasyMart/
├── backend/            ← Express API  (port 5000)
│   ├── server.js
│   ├── seed/           ← 49 sample products + admin user
│   ├── .env.example
│   └── src/
│       ├── config/        db.js, stripe.js
│       ├── models/        User, Product, Cart, Wishlist, Order
│       ├── controllers/   auth, product, cart, wishlist, order, payment
│       ├── routes/
│       ├── middleware/    authMiddleware (protect), adminMiddleware
│       └── utils/         pricing.js, sendEmail.js
└── frontend/           ← React app (port 5173)
    ├── index.html, vite.config.js, .env.example
    └── src/
        ├── pages/         Home, Shop, ProductDetails, Cart, Checkout, Orders,
        │                  PaymentSuccess, PaymentCancelled, Login, Signup, Profile ...
        ├── components/
        ├── context/       AuthContext, CartContext, WishlistContext
        ├── services/      productService, orderService
        └── utils/         api.js (fetch wrapper + JWT)
```

---

## 1. Setup (pehli baar)

**Requirements:** Node.js 18+, MongoDB (local ya [Atlas](https://www.mongodb.com/atlas)), Stripe account (test mode, free).

### Backend
```bash
cd backend
npm install
```
`backend/.env` kholo aur values bharo:

| Variable | Kya daalna hai |
|---|---|
| `MONGO_URI` | `mongodb://127.0.0.1:27017/easymart` (local) ya Atlas link |
| `JWT_SECRET` | koi bhi lamba random string |
| `STRIPE_SECRET_KEY` | Stripe Dashboard → Developers → API keys → `sk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Step 3 me milega (`whsec_...`) – optional local ke liye |
| `STRIPE_CURRENCY` | `usd` (frontend `$` dikhata hai) |
| `CLIENT_URL` | `http://localhost:5173` |

```bash
npm run seed     # 49 products + admin user database me daal deta hai
npm run dev      # http://localhost:5000
```
Admin login: **admin@easymart.com / Admin@12345** (seed banata hai – baad me password badal do).

### Frontend
```bash
cd frontend
npm install
npm run dev      # http://localhost:5173
```
`frontend/.env` me `VITE_API_URL=http://localhost:5000/api` already set hai.

### Stripe test payment
Checkout par **"Pay online by Card"** chuno → Stripe page khulega → test card:

- Card: `4242 4242 4242 4242`
- Date: koi bhi future date, CVC: koi bhi 3 digit

Payment ke baad `/payment-success` page order **khud confirm** kar deta hai (webhook ke bina bhi local me kaam karega).

### (Optional) Webhook – production ke liye zaroori
```bash
stripe listen --forward-to localhost:5000/api/payments/webhook
```
Jo `whsec_...` print ho use `STRIPE_WEBHOOK_SECRET` me daalo, backend restart karo.
Webhook aur success-page dono same function (`fulfillOrder`) chalate hain – **duplicate order kabhi nahi banta** (Order me `stripeSessionId` unique hai).

---

## 2. Poora flow – kaise kaam karta hai

1. **Signup/Login** → backend password `bcrypt` se hash karta hai, **JWT** (7 din) deta hai → frontend `localStorage("token")` me rakhta hai → `utils/api.js` har request me `Authorization: Bearer <token>` lagata hai.
2. **Products** → sab data MongoDB se (`/api/products`): search, category, price, rating, sort, pagination. Home ke *Featured* / *Best Selling* / *Related* bhi API se.
3. **Cart** → browser (`localStorage`) me rehta hai taaki guest bhi add kar sake.
4. **Checkout** → "Pay" dabate hi:
   1. Browser cart → server cart me copy hota hai (`syncCartToServer`)
   2. Server **DB se price uthata hai** (frontend ki price pe bharosa nahi), stock check karta hai, shipping + tax + coupon khud calculate karta hai (`utils/pricing.js`)
   3. **Stripe** → Stripe Checkout session bana kar URL deta hai, user Stripe ke page par jaata hai
   4. **COD** → order seedha ban jaata hai, stock kam hota hai
5. **Payment success** → order bana, stock kam, cart saaf, `/orders` me dikhta hai.

### Coupons
`SAVE10` (10%), `SAVE20` (20%) – `backend/src/utils/pricing.js` me badal sakte ho (frontend `CartContext.jsx` me bhi same values).

### Shipping / Tax
Standard $10 (subtotal > $100 ho to free), Express $25, Tax 5%.

---

## 3. API list

| Method | URL | Access |
|---|---|---|
| POST | `/api/auth/register`, `/api/auth/login` | public |
| GET | `/api/auth/me` | user |
| PUT | `/api/auth/profile` | user |
| POST | `/api/auth/forgot-password` | public |
| PUT | `/api/auth/reset-password/:token` | public |
| GET | `/api/products` (`search, category, minPrice, maxPrice, minRating, sort, featured, bestSelling, page, limit`) | public |
| GET | `/api/products/categories`, `/api/products/:id` | public |
| POST/PUT/DELETE | `/api/products`, `/api/products/:id` | **admin** |
| GET/POST/PUT/DELETE | `/api/cart`, `/add`, `/update`, `/remove/:productId`, `/clear` | user |
| GET/POST/DELETE | `/api/wishlist`, `/add`, `/remove/:productId` | user |
| POST | `/api/orders` (COD) | user |
| GET | `/api/orders/my`, `/api/orders/:id` | user |
| GET / PUT | `/api/orders`, `/api/orders/:id/status` | **admin** |
| POST | `/api/payments/create-checkout-session`, `/api/payments/confirm` | user |
| POST | `/api/payments/webhook` | Stripe |

**Naya product add karna (admin):** Postman/Thunder Client se admin login karo → token copy → `POST /api/products` with `Authorization: Bearer <token>` aur body:
```json
{ "name": "Mango 1kg", "description": "Sweet", "price": 4.5, "category": "Fruits",
  "image": "https://...", "stock": 30, "featured": true }
```

**Forgot password:** SMTP set nahi hai to reset link **backend terminal me print** hota hai (copy karke browser me kholo). Real email ke liye `.env` me `SMTP_*` bharo (Gmail App Password / Mailtrap).

---

## 4. Tumhare project me jo bugs the aur fix kiye

**Backend**
- `server.js`, `package.json`, `.env` the hi nahi → bana diye
- Stripe webhook ko raw body chahiye, par `express.json()` pehle chalta to signature fail hota → order sahi middleware sequence
- Payment amount me shipping/tax/coupon nahi jaate the (frontend total ≠ Stripe total) → ab server calculate karta hai
- Success/cancel URLs hardcoded → `CLIENT_URL` env se
- Order cart se banta tha (payment ke baad cart badal jaye to galat) → ab Stripe ke *actually paid* line items se banta hai
- Stock race condition → atomic `findOneAndUpdate` (stock >= qty)
- Search me regex injection/ReDoS → escape
- Product model me `brand, oldPrice, discount, featured, bestSelling` nahi the; `minlength:6` hashed password par bekaar tha
- Naye: My Orders, admin orders, forgot/reset password, profile update, categories endpoint, rating filter

**Frontend**
- `ForgotPassword` / `UpdatePassword` me `supabase` use ho raha tha (define hi nahi → crash) → backend se joda
- `Profile` `user_metadata.full_name` (supabase) padh raha tha → `user.name`
- `App.jsx` me stray `;` page par dikhta tha
- Home page, ProductDetails, RelatedProducts static array use kar rahe the → MongoDB API
- `ProductDetails` `Number(id)` se compare karta tha (Mongo ids string hoti hain)
- `addToCart` quantity ignore karta tha; coupon discount cart badalne par galat rehta tha
- Checkout sirf toast tha (order banta hi nahi) → real Stripe/COD checkout
- Shop ka category dropdown sirf current page se banta tha → DB se
- Shop har keystroke par API call karta tha → 400ms debounce
- Purane numeric-id wale cart/wishlist items (jo ab crash karte) load par filter
- Login me 8-char check purane users ko rok sakta tha → ab sirf non-empty
- `react-hot-toast` unused, `RelatedProducts` me invalid JSX attribute, out-of-stock handling

---

## 5. Abhi jo cheezein jaan-boojh kar simple rakhi hain
- **Wishlist** abhi browser (`localStorage`) me hai; backend ke `/api/wishlist` endpoints ready hain, chaho to context ko unse jod sakte ho.
- **Admin panel UI** nahi hai (products API/Postman se manage hote hain).
- Product reviews section abhi demo/static hai (DB me save nahi hota).

## 6. Deploy hints
- Frontend: Vercel/Netlify → env `VITE_API_URL=https://<backend>/api`
- Backend: Render/Railway → saare `.env` variables daalo, `CLIENT_URL=https://<frontend-url>`
- Stripe Dashboard me webhook endpoint `https://<backend>/api/payments/webhook` (events: `checkout.session.completed`) add karo aur uska `whsec_` env me daalo.
