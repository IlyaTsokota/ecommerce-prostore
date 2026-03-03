import { generateAccessToken, paypal } from "../lib/paypal";

describe("PayPal", () => {
    test("generates token from paypal", async () => {
        const response = await generateAccessToken();

        expect(typeof response).toBe("string");
        expect(response.length).toBeGreaterThan(0);
    });

    test("creates a paypal order", async () => {
        const price = "10.0";
        const response = await paypal.createOrder(price);
        console.log(response);

        expect(response).toHaveProperty("id");
        expect(response).toHaveProperty("status");
        expect(response.status).toBe("CREATED");
    });

    test("creates a paypal order", async () => {
        const price = "10.0";
        const response = await paypal.createOrder(price);

        expect(response).toHaveProperty("id");
        expect(response).toHaveProperty("status");
        expect(response.status).toBe("CREATED");
    });

    test("simulate capturing a payment from an order", async () => {
        const orderId = "100";
        const mockCapturePayment = jest.spyOn(paypal, "capturePayment").mockResolvedValue({
            status: "COMPLETED",
        });

        const response = await paypal.capturePayment(orderId);

        expect(response).toHaveProperty("status", "COMPLETED");

        mockCapturePayment.mockRestore();
    });
});
