const expenseForm = document.getElementById('expenseForm');
const expenseList = document.getElementById('expenseList');
const dateRangeForm = document.getElementById('dateRangeForm');
const sortSelect = document.getElementById('sortSelect');

// Function to fetch expenses from the backend
async function fetchExpenses() {
    const response = await fetch('/get_expenses');
    const expenses = await response.json();

    // Clear existing list
    expenseList.innerHTML = '';

    // Populate expense list
    expenses.forEach(expense => {
        const row = `
            <tr>
                <td>${expense[1]}</td>
                <td>$${expense[2]}</td>
                <td>${expense[3]}</td>
                <td><span class="edit" data-id="${expense[0]}">Edit</span></td>
                <td><span class="delete" data-id="${expense[0]}">Delete</span></td>
            </tr>
        `;
        expenseList.innerHTML += row;
    });

    // Update total expenses display
    await updateTotalExpenses();
}

// Function to fetch expenses within a date range from the backend
async function fetchExpensesInDateRange(startDate, endDate) {
    const response = await fetch('/get_expenses_in_date_range', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `startDate=${startDate}&endDate=${endDate}`
    });
    const expenses = await response.json();
    return expenses;
}

// Function to fetch sorted expenses from the backend
async function fetchSortedExpenses(sortBy) {
    const response = await fetch('/get_sorted_expenses', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `sortBy=${sortBy}`
    });
    const expenses = await response.json();
    return expenses;
}

// Function to calculate total expenses
async function calculateTotalExpenses() {
    const response = await fetch('/get_expenses');
    const expenses = await response.json();

    let total = 0;
    expenses.forEach(expense => {
        total += parseFloat(expense[2]);
    });

    return total;
}

// Update the total expenses display
async function updateTotalExpenses() {
    const total = await calculateTotalExpenses();
    document.getElementById('totalExpenses').textContent = `$${total.toFixed(2)}`;
}

// Event listener for form submission to add expense
expenseForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const name = document.getElementById('expenseName').value;
    const amount = document.getElementById('expenseAmount').value;
    const date = document.getElementById('expenseDate').value;

    const response = await fetch('/add_expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `expenseName=${name}&expenseAmount=${amount}&expenseDate=${date}`
    });

    // Refresh expense list
    await fetchExpenses();

    // Reset the form after submission
    expenseForm.reset();
});

// Event listener for form submission to filter expenses by date range
dateRangeForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    const expenses = await fetchExpensesInDateRange(startDate, endDate);

    // Clear existing list
    expenseList.innerHTML = '';

    // Populate expense list
    expenses.forEach(expense => {
        const row = `
            <tr>
                <td>${expense[1]}</td>
                <td>$${expense[2]}</td>
                <td>${expense[3]}</td>
                <td><span class="edit" data-id="${expense[0]}">Edit</span></td>
                <td><span class="delete" data-id="${expense[0]}">Delete</span></td>
            </tr>
        `;
        expenseList.innerHTML += row;
    });

    // Update total expenses display
    await updateTotalExpenses();
});

// Event listener for sorting expenses
sortSelect.addEventListener('change', async function(event) {
    const sortBy = event.target.value;
    const expenses = await fetchSortedExpenses(sortBy);

    // Clear existing list
    expenseList.innerHTML = '';

    // Populate expense list
    expenses.forEach(expense => {
        const row = `
            <tr>
                <td>${expense[1]}</td>
                <td>$${expense[2]}</td>
                <td>${expense[3]}</td>
                <td><span class="edit" data-id="${expense[0]}">Edit</span></td>
                <td><span class="delete" data-id="${expense[0]}">Delete</span></td>
            </tr>
        `;
        expenseList.innerHTML += row;
    });
});

// Fetch expenses when the page loads
window.onload = async function() {
    await fetchExpenses();
};
