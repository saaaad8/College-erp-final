import React, { useEffect, useState } from 'react';
import { Container, Grid, Paper, Typography, Button, Snackbar, Alert } from '@mui/material';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import PaymentIcon from '@mui/icons-material/Payment';
import DescriptionIcon from '@mui/icons-material/Description';
import { green } from '@mui/material/colors';

const stripePromise = loadStripe('pk_test_51PnHwC04kxnef05X4ioiwNTmJBk1bm2EP4J8hudSsRfj2aUgAcZcC720lvOWVb2hrhvp026WU40jxxXp4Gc7Yjha00SVde3DoZ'); // Replace with your actual Stripe publishable key

const PaymentPage = () => {
    const { currentUser } = useSelector(state => state.user);
    const [paymentDetails, setPaymentDetails] = useState({ amount: 0, description: 'Tuition Fees' });
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [paymentId, setPaymentId] = useState('');

    useEffect(() => {
        // Simulating fetching payment details (amount, description, etc.)
        setPaymentDetails({ amount: 39805, description: 'Tuition Fees for the Academic Year' });
    }, [currentUser]);

    const handlePayNow = () => {
        // Simulate a payment process
        setPaymentId(`PAY_${Math.floor(Math.random() * 1000000)}`); // Fake payment ID
        setOpenSnackbar(true); // Show snackbar
    };

    return (
        <StyledContainer maxWidth="md">
            <Title>Payment Details</Title>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <StyledPaper elevation={4}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <DescriptionIcon sx={{ color: green[600], marginRight: 1 }} /> Payment Summary
                        </Typography>
                        <Typography variant="body1">Description: {paymentDetails.description}</Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', marginTop: 2 }}>
                            <Typography variant="h5" sx={{ fontSize: 30, verticalAlign: 'middle', marginRight: 0.5 }}>
                                Rs: {paymentDetails.amount}
                            </Typography>
                        </Typography>
                    </StyledPaper>
                </Grid>
                <Grid item xs={12}>
                    <StyledPaper elevation={4}>
                        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', marginBottom: 2 }}>
                            <PaymentIcon sx={{ color: green[600], marginRight: 1 }} /> Checkout
                        </Typography>
                        <Elements stripe={stripePromise}>
                            <CheckoutForm onPayNow={handlePayNow} />
                        </Elements>
                    </StyledPaper>
                </Grid>
                <Grid item xs={12}>
                    <StyledButton variant="contained" onClick={handlePayNow}>
                        Pay Now
                    </StyledButton>
                </Grid>
            </Grid>
            <Snackbar 
                open={openSnackbar} 
                autoHideDuration={6000} 
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert onClose={() => setOpenSnackbar(false)} severity="success" sx={{ width: '100%' }}>
                    Payment Successful! Your payment ID is: {paymentId}
                </Alert>
            </Snackbar>
        </StyledContainer>
    );
};

const StyledContainer = styled(Container)`
  background: linear-gradient(135deg, #f5f5f5 30%, #e0e0e0 100%);
  border-radius: 8px;
  padding: 20px;
  margin-top: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
`;

const StyledPaper = styled(Paper)`
  padding: 16px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
`;

const Title = styled.h2`
  text-align: center;
  margin-bottom: 20px;
  color: #333;
  font-weight: 600;
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  width: 100%;
  background-color: #4caf50;
  &:hover {
    background-color: #45a049;
  }
`;

export default PaymentPage;
