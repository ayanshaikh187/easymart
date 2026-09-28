import apiRequest from "../utils/api";

// The backend reads the user's SERVER cart, so we first copy the
// browser cart (localStorage) to the server, then create the order/payment.
export const syncCartToServer = async (cart) => {
  // 404 "Cart not found" is fine (first time user)
  await apiRequest("/cart/clear", { method: "DELETE" }).catch(() => {});

  for (const item of cart) {
    await apiRequest("/cart/add", {
      method: "POST",
      body: JSON.stringify({ productId: item.id, quantity: item.quantity }),
    });
  }
};

export const createStripeSession = (payload) =>
  apiRequest("/payments/create-checkout-session", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const confirmPayment = (sessionId) =>
  apiRequest("/payments/confirm", {
    method: "POST",
    body: JSON.stringify({ sessionId }),
  });

export const createCodOrder = (payload) =>
  apiRequest("/orders", {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const getMyOrders = () => apiRequest("/orders/my");
