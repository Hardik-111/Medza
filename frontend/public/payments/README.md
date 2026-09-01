# Clinic payment QR asset

Place a display-only clinic QR image here as:

`clinic-upi-qr.png`

The preferred booking flow uses Razorpay Checkout, which shows a dynamic QR code and confirms payment server-side before completing the booking. A static QR image is useful for displaying your UPI details, but cannot automatically prove which booking was paid without a payment-provider webhook or reconciliation process.
