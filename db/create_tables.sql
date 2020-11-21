-- Create entities (tables)

CREATE TABLE "Booking"(
    id                SERIAL     NOT NULL PRIMARY KEY,
    table_number      INTEGER     NOT NULL,
    customer_fname    VARCHAR(64) NOT NULL,
    customer_lname    VARCHAR(64),
    customer_email    VARCHAR(128),
    customer_phone_no VARCHAR(20) NOT NULL,
    date_booked       TIMEsTAMP WITH TIME ZONE   NOT NULL,
    date_booked_for   TIMEsTAMP WITH TIME ZONE   NOT NULL,
    status            VARCHAR(15) NOT NULL
);

CREATE TABLE "Table"(
    t_number SERIAL NOT NULL PRIMARY KEY,
    details  VARCHAR(50) 
);

CREATE TABLE "Order"(
    id              SERIAL     NOT NULL PRIMARY KEY,
    booking_id      INTEGER     NOT NULL,
    table_number    INTEGER     NOT NULL,
    order_date      TIMESTAMP WITH TIME ZONE        NOT NULL 
);

CREATE TABLE "Order_menu_item"(
    id           SERIAL      NOT NULL PRIMARY KEY,
    order_id     INTEGER     NOT NULL,
    menu_item_id INTEGER     NOT NULL,
    quantity     DECIMAL(12) NOT NULL, 
    comments     VARCHAR(128)          
);

CREATE TABLE "Menu_item"(
    id          SERIAL        NOT NULL PRIMARY KEY,
    menu_id     INTEGER       NOT NULL,
    name        VARCHAR(80)   NOT NULL,
    price       DECIMAL(12)   NOT NULL,
    link        VARCHAR(2048) NOT NULL,
    description VARCHAR(512)    
);

CREATE TABLE "Menu"(
    id        SERIAL  NOT NULL PRIMARY KEY,
    menu_date DATE    NOT NULL,
    description VARCHAR(128) 
);

CREATE TABLE "Menu_item_ingredient"(
    id            SERIAL     NOT NULL PRIMARY KEY,
    ingredient_id INTEGER     NOT NULL,
    menu_item_id  INTEGER     NOT NULL,
    item_quantity DECIMAL(12) NOT NULL, 
    standart_cost DECIMAL(12) NOT NULL
);

CREATE TABLE "Ingredient"(
    id              SERIAL     NOT NULL PRIMARY KEY,
    type_code       INTEGER     NOT NULL,
    name            VARCHAR(42) NOT NULL 
);

CREATE TABLE "Ingredient_type"(
    code        INTEGER     NOT NULL PRIMARY KEY,
    description VARCHAR(20) NOT NULL
);

CREATE TABLE "Supplier"(
    id                   SERIAL     NOT NULL PRIMARY KEY,
    ingredient_type_code INTEGER,
    company_name         VARCHAR(64) NOT NULL, 
    address              VARCHAR(30) NOT NULL, 
    phone_number         VARCHAR(20) NOT NULL, 
    email_address        VARCHAR(128) NOT NULL  
);

CREATE TABLE "Platform"(
    name        VARCHAR(12) NOT NULL PRIMARY KEY, 
    query_count INTEGER
);

CREATE TABLE "User" (
    id UUID NOT NULL PRIMARY KEY, 
    username   VARCHAR(64) NOT NULL,
    email      VARCHAR(128) NOT NULL,
    password   VARCHAR(60) NOT NULL,
    is_admin   BOOLEAN NOT NULL
);
