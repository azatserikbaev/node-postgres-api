-- add constraints to tables
ALTER TABLE "Booking"
    ADD FOREIGN KEY (table_number) REFERENCES "Table"(t_number);

ALTER TABLE "Order"
    ADD FOREIGN KEY (booking_id)  REFERENCES "Booking"(id),
    ADD FOREIGN KEY (table_number) REFERENCES "Table"(t_number);

ALTER TABLE "Order_menu_item"
    ADD FOREIGN KEY (order_id)     REFERENCES "Order"(id),
    ADD FOREIGN KEY (menu_item_id) REFERENCES "Menu_item"(id);

ALTER TABLE "Menu_item"
    ADD FOREIGN KEY (menu_id) REFERENCES "Menu"(id);

ALTER TABLE "Menu_item_ingredient"
    ADD FOREIGN KEY (ingredient_id) REFERENCES "Ingredient"(id),
    ADD FOREIGN KEY (menu_item_id) REFERENCES "Menu_item"(id);

ALTER TABLE "Ingredient"
    ADD FOREIGN KEY (type_code) REFERENCES "Ingredient_type"(code);

ALTER TABLE "Supplier"
    ADD FOREIGN KEY (ingredient_type_code) REFERENCES "Ingredient_type"(code);
