create database safe_savings;
use safe_savings;

CREATE TABLE users 
( 
 id INT PRIMARY KEY AUTO_INCREMENT,  
 password VARCHAR(120) NOT NULL,
 user VARCHAR(20) NOT NULL,
 EE_rate FLOAT NOT NULL DEFAULT 0.0
); 

CREATE TABLE products 
( 
 product_id INT PRIMARY KEY AUTO_INCREMENT,  
 product_name VARCHAR(50) NOT NULL,  
 price INT NOT NULL,  
 efficiency FLOAT NOT NULL,  
 EE_label CHAR(1) NOT NULL,  
 category VARCHAR(15) NOT NULL  
); 

CREATE TABLE orders 
( 
 order_id INT PRIMARY KEY,  
 product_id INT NOT NULL,  
 quanitity INT NOT NULL,  
 id INT
); 

ALTER TABLE orders ADD FOREIGN KEY(product_id) REFERENCES products (product_id);
ALTER TABLE orders ADD FOREIGN KEY(id) REFERENCES users (id);
