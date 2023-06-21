-- Insert expenses into the table
INSERT INTO TransactionCategory (name, isExpense, public)
VALUES ('Food & Drink', true, true),
    ('Groceries', true, true),
    ('Transportation', true, true),
    ('Services', true, true),
    ('Health', true, true),
    ('Gifts', true, true),
    ('Gaming & Streaming', true, true),
    ('Education', true, true),
    ('Debts', true, true),
    ('Other', true, true);

-- Insert incomes into the table
INSERT INTO TransactionCategory (name, isExpense, public)
VALUES ('Paycheck', false, true),
    ('Interests', false, true),
    ('Gift', false, true),
    ('Other', false, true);