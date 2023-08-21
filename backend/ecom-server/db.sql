-- user_info
CREATE TABLE user_info (
    email VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    address TEXT NOT NULL
);

--payment_info
CREATE TABLE payment_info (
    email VARCHAR(255) PRIMARY KEY REFERENCES user_info(email),
    bank_acc VARCHAR(20) NOT NULL
);

--cart
CREATE TABLE cart (
    email VARCHAR(255) PRIMARY KEY REFERENCES user_info(email),
    item1 INTEGER DEFAULT 0 CHECK (item1 >= 0),
    item2 INTEGER DEFAULT 0 CHECK (item2 >= 0),
    item3 INTEGER DEFAULT 0 CHECK (item3 >= 0)
);

--order table
CREATE TABLE "order" (
    order_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) REFERENCES user_info(email),
    address TEXT NOT NULL,
    item1 INTEGER CHECK (item1 >= 0),
    item2 INTEGER CHECK (item2 >= 0),
    item3 INTEGER CHECK (item3 >= 0),
    amount NUMERIC CHECK (amount >= 0),
    approved BOOLEAN DEFAULT false,
    shipped BOOLEAN DEFAULT false
);

--item table
CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
  item_name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  quantity INTEGER NOT NULL,
  image VARCHAR(255),
  item_price NUMERIC(10, 2) NOT NULL,
  description TEXT,
  CHECK (item_id >= 1 AND item_id <= 3)
    
);







