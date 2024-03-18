from flask import Flask, render_template, request, jsonify
import sqlite3

app = Flask(__name__)

# Function to create a database and table if they don't exist
def create_database():
    conn = sqlite3.connect('expenses.db')
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS expenses
                 (id INTEGER PRIMARY KEY AUTOINCREMENT,
                 name TEXT,
                 amount REAL,
                 date TEXT)''')
    conn.commit()
    conn.close()

# Function to add an expense to the database
def add_expense(name, amount, date):
    conn = sqlite3.connect('expenses.db')
    c = conn.cursor()
    c.execute("INSERT INTO expenses (name, amount, date) VALUES (?, ?, ?)",
              (name, amount, date))
    conn.commit()
    conn.close()

# Function to get all expenses from the database
def get_all_expenses():
    conn = sqlite3.connect('expenses.db')
    c = conn.cursor()
    c.execute("SELECT * FROM expenses")
    expenses = c.fetchall()
    conn.close()
    return expenses

# Function to get expenses within a date range from the database
def get_expenses_in_date_range(start_date, end_date):
    conn = sqlite3.connect('expenses.db')
    c = conn.cursor()
    c.execute("SELECT * FROM expenses WHERE date BETWEEN ? AND ?", (start_date, end_date))
    expenses = c.fetchall()
    conn.close()
    return expenses

# Function to get sorted expenses from the database
def get_sorted_expenses(sort_by):
    conn = sqlite3.connect('expenses.db')
    c = conn.cursor()
    c.execute(f"SELECT * FROM expenses ORDER BY {sort_by}")
    expenses = c.fetchall()
    conn.close()
    return expenses

# Function to delete an expense from the database
def delete_expense(expense_id):
    conn = sqlite3.connect('expenses.db')
    c = conn.cursor()
    c.execute("DELETE FROM expenses WHERE id=?", (expense_id,))
    conn.commit()
    conn.close()

# Function to update an expense in the database
def update_expense(expense_id, name, amount, date):
    conn = sqlite3.connect('expenses.db')
    c = conn.cursor()
    c.execute("UPDATE expenses SET name=?, amount=?, date=? WHERE id=?",
              (name, amount, date, expense_id))
    conn.commit()
    conn.close()

# Route for the homepage
@app.route('/')
def home():
    return render_template('index.html')

# Route to handle form submission and add expense to the database
@app.route('/add_expense', methods=['POST'])
def add_expense_route():
    name = request.form['expenseName']
    amount = float(request.form['expenseAmount'])
    date = request.form['expenseDate']
    
    add_expense(name, amount, date)
    
    return jsonify({'success': True})

# Route to handle fetching all expenses
@app.route('/get_expenses')
def get_expenses():
    expenses = get_all_expenses()
    return jsonify(expenses)

# Route to handle fetching expenses within a date range
@app.route('/get_expenses_in_date_range', methods=['POST'])
def get_expenses_in_date_range_route():
    start_date = request.form['startDate']
    end_date = request.form['endDate']
    expenses = get_expenses_in_date_range(start_date, end_date)
    return jsonify(expenses)

# Route to handle fetching sorted expenses
@app.route('/get_sorted_expenses', methods=['POST'])
def get_sorted_expenses_route():
    sort_by = request.form['sortBy']
    expenses = get_sorted_expenses(sort_by)
    return jsonify(expenses)

# Route to handle deleting an expense
@app.route('/delete_expense', methods=['POST'])
def delete_expense_route():
    expense_id = request.form['expenseId']
    delete_expense(expense_id)
    return jsonify({'success': True})

# Route to handle updating an expense
@app.route('/update_expense', methods=['POST'])
def update_expense_route():
    expense_id = request.form['expenseId']
    name = request.form['name']
    amount = request.form['amount']
    date = request.form['date']
    update_expense(expense_id, name, amount, date)
    return jsonify({'success': True})

if __name__ == "__main__":
    create_database()
    app.run(debug=True)
