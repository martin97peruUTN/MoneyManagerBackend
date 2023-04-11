CREATE TABLE IF NOT EXISTS user (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50),
    password VARCHAR(255),
    name VARCHAR(50),
    lastname VARCHAR(50)
);

INSERT INTO user (username, password, name, lastname) VALUES 
('mperussini', '1234', 'Martin', 'Perussini'),
('travelli', '1234', 'Tomas', 'Ravelli');


CREATE TABLE IF NOT EXISTS account (
    id SERIAL PRIMARY KEY,
    balance FLOAT NOT NULL,
    currency VARCHAR(10),
    user_id INT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS tranfer (
    id SERIAL PRIMARY KEY,
    amount FLOAT NOT NULL,
    comment VARCHAR(100),
    transferDate DATE NOT NULL,
    origin_account_id INT NOT NULL,
    destiny_account_id INT NOT NULL,
    FOREIGN KEY (origin_account_id) REFERENCES account (id),
    FOREIGN KEY (destiny_account_id) REFERENCES account (id)
);

CREATE TABLE IF NOT EXISTS transaction_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50),
    is_expense BOOL NOT NULL
);

CREATE TABLE IF NOT EXISTS transaction (
    id SERIAL PRIMARY KEY,
    amount FLOAT NOT NULL,
    comment VARCHAR(100),
    transferDate DATE NOT NULL,
    account_id INT NOT NULL,
    transaction_category_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES account (id),
    FOREIGN KEY (transaction_category_id) REFERENCES transaction_category (id)
);



ALTER TABLE tranfer
ADD COLUMN id SERIAL PRIMARY KEY,
ADD COLUMN balance FLOAT NOT NULL,
ADD COLUMN currency VARCHAR(10) NOT NULL

