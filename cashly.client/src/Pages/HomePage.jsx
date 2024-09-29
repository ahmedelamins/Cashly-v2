import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    TextField,
    Grid,
    Stack,
    Paper,
    MenuItem,
    Divider,
    IconButton,
    Card
} from '@mui/material';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const categories = ['Utility', 'Food', 'Fun', 'Shopping', 'Other'];

const HomePage = () => {
    const username = localStorage.getItem('username'); // Fetching username
    const Username = username.charAt(0).toUpperCase() + username.slice(1); //Capitalize first letter

    const [loading, setLoading] = useState(false);
    const [expenses, setExpenses] = useState([])
    const [openAddExpense, setOpenAddExpense] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        amount: "",
        date: "",
        category: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        })
    };

    //open dialog
    const handleOpenAddExpense = () => {
        setOpenAddExpense(true);
    }

    //close dialog
    const handleCloseAddExpense = () => {
        setOpenAddExpense(false);
        setFormData({ title: "", amount: "", date: "", category: "" }); //reset formData
    }

    //submit expense
    const handleAddExpenseSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const expenseData = {
                title: formData.title,
                amount: parseFloat(formData.amount),
                date: formData.date,
                category: formData.category,
            }

            const response = await axiosInstance.post('/expense', expenseData);

            setTimeout(() => {
                toast.success(response.data.message);
                setLoading(false);
                handleCloseAddExpense();
                fetchExpenses();  // Fetch the updated list of expenses after adding
            }, 1000);

        } catch (error) {
            toast.error(error.response.data);
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    };

    //grab expenses
    const fetchExpenses = async () => {
        try {
            const response = await axiosInstance.get('/expense');
            setExpenses(response.data.data);
        } catch (error) {
            console.log(error)
            toast.error("Something went wrong")
        }
    }

    useEffect(() => {
        fetchExpenses();
    }, [])

    return (
        <Box sx={{ mt: 1, mb: 2, p: 1 }} >
            <Typography variant="h4" gutterBottom sx={{ letterSpacing: '0.10em', textAlign: 'left' }}>
                Hello, {Username}!
            </Typography>
            <Button
                variant="contained"
                onClick={handleOpenAddExpense}
                sx={{
                    mt: 3,
                    fontWeight: "540",
                    py: 1.4,
                    px: 3,
                    transition: 'transform 0.3s ease',
                    '&:hover': {
                        transform: 'scale(1.1)',
                    },
                }}>
                Add Expense
            </Button>

            {/* chart and history containers */}
            <Grid container spacing={2} sx={{ mt: 2 }}>
                {/* chart container*/}
                <Grid item xs={12} md={6} sx={{ mb: 2 }}>
                    <Paper elevation={3} sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                            Expenditure
                        </Typography>
                        <Box sx={{ width: { xs: '100%', md: '70%' }, mx: 'auto' }}>
                            <h5> Chart Container here</h5>
                        </Box>
                    </Paper>
                </Grid>

                {/* expense history container */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 2, maxHeight: '470px', overflowY: 'auto' }}>
                        <Typography variant="h6" sx={{ mb: 2, textAlign: 'center' }}>
                            Recent History
                        </Typography>
                        <Stack spacing={2}>
                            {expenses.length > 0 ? (
                                expenses.map((expense, index) => (
                                    <Card key={index} sx={{ p: 2 }}>
                                        {/* Flex container for title, amount, and actions */}
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="h6">
                                                    {expense.title}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {new Date(expense.date).toLocaleDateString()}
                                                </Typography>
                                            </Box>

                                            <Box display="flex" alignItems="center">
                                                <Typography variant="h6" color="primary" sx={{ mr: 2 }}>
                                                    ${expense.amount.toFixed(2)}
                                                </Typography>
                                                {/* Placeholder for future Edit and Delete buttons */}
                                                <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                                                    Edit
                                                </Button>
                                                <Button variant="outlined" size="small" color="error">
                                                    Delete
                                                </Button>
                                            </Box>
                                        </Box>

                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            Category: {expense.category}
                                        </Typography>
                                    </Card>
                                ))
                            ) : (
                                <Typography variant="body2" sx={{ textAlign: 'center', mt: 2 }}>
                                    No expenses found.
                                </Typography>
                            )}
                        </Stack>
                    </Paper>
                </Grid>
            </Grid>

            {/* new expense form dialog */}
            <Dialog open={openAddExpense} onClose={handleCloseAddExpense}>
                <DialogTitle>New Expense</DialogTitle>
                <DialogContent>
                    {loading ? <CircularProgress /> : (
                        <Box component="form" onSubmit={handleAddExpenseSubmit}>
                            <TextField
                                margin="dense"
                                name="title"
                                label="Title"
                                type="text"
                                fullWidth
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                            <TextField
                                margin="dense"
                                name="amount"
                                label="Amount"
                                type="number"
                                fullWidth
                                required
                                value={formData.amount}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="dense"
                                name="category"
                                label="Category"
                                select
                                fullWidth
                                variant="outlined"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                {categories.map((category) => (
                                    <MenuItem key={category} value={category}>
                                        {category}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                margin="dense"
                                name="date"
                                label="Date"
                                type="date"
                                variant="outlined"
                                InputLabelProps={{ shrink: true }}
                                value={formData.date}
                                onChange={handleChange}
                                required
                            />
                            <DialogActions>
                                <Button
                                    variant="outlined"
                                    onClick={handleCloseAddExpense}>
                                    Discard
                                </Button>
                                <Button
                                    variant="contained"
                                    type="submit">
                                    submit
                                </Button>
                            </DialogActions>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>
        </Box>
    );
}

export default HomePage;
