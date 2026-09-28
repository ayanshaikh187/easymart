import Navbar from "../components/layout/Navbar";
import Footer from "../components/home/Footer";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { toast } from "react-toastify";

function Cart() {
    const [couponCode, setCouponCode] = useState("");
    const {
        cart,
        increaseQty,
        decreaseQty,
        removeFromCart,
        clearCart,
        subtotal,
        shipping,
        tax,
        total,
        totalItems,
        discount,
        applyCoupon,
        shippingMethod,
        setShippingMethod,
    } = useCart();

    return (
        <>
            <Navbar />

            <section className="max-w-7xl mx-auto px-6 py-20">

                <h1 className="text-5xl font-bold mb-10">
                    Shopping Cart
                </h1>

                {cart.length === 0 ? (
                    <h2>Your cart is empty.</h2>
                ) : (
                    <>
                        {cart.map((item) => (

                            <div
                                key={item.id}
                                className="flex justify-between items-center shadow rounded-2xl p-6 mb-6"
                            >

                                <div className="flex gap-5 items-center">

                                    <img
                                        src={item.image}
                                        className="w-24 h-24 rounded-xl object-cover"
                                    />

                                    <div>

                                        <h2 className="font-bold">
                                            {item.name}
                                        </h2>

                                        <p>${item.price}</p>

                                    </div>

                                </div>

                                <div className="flex gap-3">

                                    <button
                                        onClick={() => decreaseQty(item.id)}
                                        className="px-4 py-2 bg-gray-200 rounded"
                                    >
                                        -
                                    </button>

                                    <span>{item.quantity}</span>

                                    <button
                                        onClick={() => increaseQty(item.id)}
                                        className="px-4 py-2 bg-gray-200 rounded"
                                    >
                                        +
                                    </button>

                                </div>

                                <button
                                    onClick={() =>
                                        removeFromCart(item.id)
                                    }
                                    className="text-red-500"
                                >
                                    Remove
                                </button>
                            </div>

                        ))}
                        <div className="mt-10 bg-gray-100 rounded-2xl p-6">

                            <div className="flex justify-between mb-3">
                                <span>Subtotal</span>
                                <span>${subtotal.toFixed(2)}</span>
                            </div>

                            <div className="flex justify-between mb-3">
                                <span>Shipping</span>
                                <span>
                                    {shipping === 0 ? "Free" : `$${shipping}`}
                                </span>
                            </div>
                            <div className="flex justify-between mb-3">

                                <span>Discount</span>

                                <span className="text-green-600">
                                    -${discount.toFixed(2)}
                                </span>

                            </div>

                            <div className="flex justify-between mb-3">
                                <span>Tax (5%)</span>
                                <span>${tax.toFixed(2)}</span>
                            </div>

                            <hr className="my-4" />
                            <div className="flex justify-between mb-3">
                                <span>Total Items</span>
                                <span>{totalItems}</span>
                            </div>

                            <hr className="my-4" />

                            <div className="flex justify-between text-2xl font-bold">
                                <span>Grand Total</span>
                                <span>${total.toFixed(2)}</span>
                            </div>
                            <div className="mt-8">

                                <h3 className="font-bold text-xl mb-3">
                                    Coupon Code
                                </h3>

                                <div className="flex gap-3">

                                    <input
                                        type="text"
                                        placeholder="SAVE10"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        className="border rounded-xl flex-1 p-3"
                                    />

                                    <button
                                        onClick={() => {
                                            const success = applyCoupon(couponCode);

                                            if (success) {
                                                toast.success("Coupon Applied Successfully 🎉");
                                            } else {
                                                toast.error("Invalid Coupon");
                                            }
                                        }}
                                        className="bg-green-600 text-white px-6 rounded-xl"
                                    >
                                        Apply
                                    </button>

                                </div>

                            </div>
                            <div className="mt-8">

                                <h3 className="font-bold text-xl mb-3">
                                    Delivery Method
                                </h3>

                                <select
                                    value={shippingMethod}
                                    onChange={(e) => setShippingMethod(e.target.value)}
                                    className="border rounded-xl w-full p-3"
                                >

                                    <option value="standard">
                                        Standard Delivery ($10)
                                    </option>

                                    <option value="express">
                                        Express Delivery ($25)
                                    </option>

                                </select>

                            </div>
                            <Link to="/checkout">
                                <button className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl">
                                    Proceed To Checkout
                                </button>
                            </Link>

                            <button
                                onClick={clearCart}
                                className="mt-6 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl"
                            >
                                Clear Cart
                            </button>

                        </div>




                    </>
                )}

            </section>

            <Footer />

        </>
    );
}

export default Cart;