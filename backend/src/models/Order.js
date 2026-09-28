const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },

        name: {
            type: String,
            required: true,
        },

        image: {
            type: String,
            default: "",
        },

        price: {
            type: Number,
            required: true,
            min: 0,
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    },
    {
        _id: false,
    }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: {
            type: [orderItemSchema],
            required: true,
        },

        shippingAddress: {
            fullName: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            address: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            postalCode: {
                type: String,
                default: "",
            },
        },

        totalPrice: {
            type: Number,
            required: true,
            min: 0,
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },

        taxPrice: {
            type: Number,
            default: 0,
        },

        discount: {
            type: Number,
            default: 0,
        },

        paymentMethod: {
            type: String,
            enum: ["stripe", "cod"],
            default: "stripe",
        },

        // unique + sparse => same Stripe session can never create 2 orders
        stripeSessionId: {
            type: String,
            unique: true,
            sparse: true,
        },

        stripePaymentIntentId: {
            type: String,
            default: "",
        },

        paymentStatus: {
            type: String,
            enum: [
                "pending",
                "paid",
                "failed",
            ],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: [
                "processing",
                "shipped",
                "delivered",
                "cancelled",
            ],
            default: "processing",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);