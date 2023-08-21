-- Create a sequence starting from 770001
CREATE SEQUENCE acc_no_seq START WITH 770001;

-- Create the bank_user table
CREATE TABLE bank_user (
    acc_no INTEGER DEFAULT nextval('acc_no_seq') PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    pin VARCHAR(255) NOT NULL,
    address TEXT NOT NULL,
    balance DECIMAL(10, 2) DEFAULT 50000.00
);

-- Inserting supplier info manually
INSERT INTO bank_user (email, acc_no, name, pin, address)
VALUES ('supplier@example.com', '555555', 'Supplier of Ecommerce', '$2a$10$8ct8jGiPdzpI9y2B8ZrJoe3IRQAQ0ObqBkU36k69W0u1qJ7x78dUC', 'Dhaka');

-- Inserting admin info manually
INSERT INTO bank_user (email, acc_no, name, pin, address)
VALUES ('admin@example.com', '111111', 'Admin of Ecommerce', '$2a$10$hiwjmMBJh8i/IcQENbkaKusFYgDoDaXbW8/SSuJR2klsFrEM.JMmy', 'Dhaka');


-- Create a sequence for transaction_id starting from 3330
CREATE SEQUENCE transaction_id_seq START 3330;


-- Create the transaction table with custom sequence
CREATE TABLE "transaction" (
    transaction_id INTEGER PRIMARY KEY DEFAULT nextval('transaction_id_seq'),
    sender_acc INTEGER NOT NULL REFERENCES bank_user(acc_no),
    receiver_acc INTEGER NOT NULL REFERENCES bank_user(acc_no),
    amount DECIMAL(10, 2) NOT NULL,
    date DATE DEFAULT CURRENT_DATE,
    time TIME DEFAULT CURRENT_TIME
);
