import React, { useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { Typography, Grid, TextField } from '@mui/material';
import styled from 'styled-components';

const CheckoutForm = () => {
    const stripe = useStripe(); // Get the Stripe instance
    const elements = useElements(); // Get the Stripe elements instance

    const [errorMessage, setErrorMessage] = useState(null); // Error message state
    const [loading, setLoading] = useState(false); // Loading state
    const [paymentSuccess, setPaymentSuccess] = useState(false); // Success state

    const handleSubmit = async (event) => {
        event.preventDefault(); // Prevent default form submission
        setLoading(true); // Set loading state
        setErrorMessage(null); // Reset error message

        if (!stripe || !elements) {
            return; // Stripe.js hasn't loaded yet
        }

        const cardElement = elements.getElement(CardElement); // Get the CardElement

        // Create a payment method with the card information
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            setErrorMessage(error.message); // Handle error in card processing
            setLoading(false); // Reset loading state
        } else {
            try {
                // Send paymentMethod.id to your backend to create the payment
                const response = await axios.post('/api/create-payment-intent', {
                    paymentMethodId: paymentMethod.id, // Send the payment method ID
                    amount: 1000, // Replace this with the actual fee amount
                });

                if (response.data.success) {
                    setPaymentSuccess(true); // Set success state
                } else {
                    setErrorMessage('Payment failed. Please try again.'); // Handle failure
                }
            } catch (err) {
                setErrorMessage('Payment error: ' + err.message); // Handle request error
            } finally {
                setLoading(false); // Reset loading state
            }
        }
    };

    return (
        <StyledForm onSubmit={handleSubmit}>
            <Typography variant="h6">Enter Payment Details</Typography>
            <CardElementWrapper>
                <CardElement options={{
                    style: {
                        base: {
                            color: '#32325d',
                            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
                            fontSmoothing: 'antialiased',
                            fontSize: '16px',
                            lineHeight: '24px',
                            '::placeholder': {
                                color: '#aab7c4',
                            },
                        },
                        invalid: {
                            color: '#fa755a',
                            iconColor: '#fa755a',
                        },
                    },
                }} />
            </CardElementWrapper>

            {/* Additional Inputs */}
            <Grid container spacing={2} sx={{ marginTop: 2 }}>
                <Grid item xs={12} sm={6}>
                    <StyledTextField label="Card Number" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledTextField label="CVV" variant="outlined" fullWidth />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <StyledTextField label="Expiry Date (MM/YY)" variant="outlined" fullWidth />
                </Grid>
            </Grid>

            {/* Show any error message */}
            {errorMessage && <Typography color="error">{errorMessage}</Typography>}

            {/* Show success message */}
            {paymentSuccess && <Typography color="success">Payment Successful!</Typography>}
        </StyledForm>
    );
};

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
`;

const CardElementWrapper = styled.div`
    margin-bottom: 20px;
`;

const StyledTextField = styled(TextField)`
    margin-top: 16px; // Add spacing to the top
`;

export default CheckoutForm;
