const base = process.env.PAYPAL_API_URL || "https://api-m.sandbox.paypal.com";

export const paypal = {
    createOrder: async (price: string) => {
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders`;

        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                    {
                        amount: {
                            currency_code: "USD",
                            value: price,
                        },
                    },
                ],
            }),
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        return handleResponse(response);
    },

    capturePayment: async (orderId: string) => {
        const accessToken = await generateAccessToken();
        const url = `${base}/v2/checkout/orders/${orderId}/capture`;

        const response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
            },
        });

        return handleResponse(response);
    },
};

async function generateAccessToken() {
    const { PAYPAL_APP_SECRET, PAYPAL_CLIENT_ID } = process.env;
    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_APP_SECRET}`).toString("base64");

    const response = await fetch(`${base}/v1/oauth2/token`, {
        method: "POST",
        body: "grant_type=client_credentials",
        headers: {
            Authorization: `Basic ${auth}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });

    const jsonData = await handleResponse(response);

    return jsonData.access_token;
}

async function handleResponse(response: Response) {
    if (response.ok) {
        const jsonData = await response.json();

        return jsonData;
    } else {
        const errorMessage = await response.text();

        throw new Error(errorMessage);
    }
}

export { generateAccessToken };
