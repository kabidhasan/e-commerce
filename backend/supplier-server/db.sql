-- supplier_order
CREATE TABLE supplier_order (
    order_id INTEGER PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    address TEXT NOT NULL,
    item1 INTEGER CHECK (item1 >= 0),
    item2 INTEGER CHECK (item2 >= 0),
    item3 INTEGER CHECK (item3 >= 0),
    amount NUMERIC CHECK (amount >= 0),
    shipped BOOLEAN DEFAULT false
);
