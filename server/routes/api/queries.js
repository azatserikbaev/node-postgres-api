const pool = require('../../utils/pool');

const getTraffic = async (req, res, next) => {
    try {
        const { rowCount, rows } = await pool.query('SELECT * FROM "Platform" p ORDER BY p.name;');
        res.status(200).send({ rowCount, rows });
    } catch(err) {
        next(err);
    }
}

const updateTraffic = async (req, res, next) => {
    var isMobile = req.useragent.isMobile;
    try {
        const rows = await pool.query('UPDATE "Platform" SET query_count = query_count + 1 WHERE name = $1;', [(isMobile) ? 'mobile' : 'nonmobile']);
        next();
    } catch(err) {
        next(err);
    }
};

const getBookings = async (req, res, next) => {
    var { page } = req.params;
    if (!page) page = 1;
    else if (isNaN(parseInt(page)) || page < 1) {
        res.status(400);
        res.send({error: 'Page must be a positive integer.'});
        return;
    }
    try {
        const { rowCount, rows } = await pool.query('SELECT * FROM "Booking" b ORDER BY b.id DESC LIMIT 15 OFFSET 15*$1', [page - 1]);
        res.status(200).send({ rowCount, rows });
    } catch (err) {
        next(err);
    }
};

const getBookingById = async (req, res, next) => {
    const { booking_id } = req.params;
    if (isNaN(parseInt(booking_id)) || booking_id < 1) {
        res.status(400);
        res.send({error: 'Booking id must be a positive integer.'});
        return;
    }
    try {
        const { rowCount, rows } = await pool.query('SELECT * FROM "Booking" b WHERE b.id = $1;', [booking_id]);
        res.status(200).send({ rowCount, rows });
    } catch (err) {
        next(err);
    }
}

const getFreeTables = async (req, res, next) => {
    const date_booked_for = req.body.date_booked_for || req.query.date_booked_for;
    if (!date_booked_for) {
        var err = new Error('date_booked_for not specified');
        err.status = 400;
        return next(err);
    }
    try {
        const { rows } = await pool.query('SELECT t_number FROM "Table" EXCEPT (SELECT t_number FROM "Booking" b JOIN "Table" t ON (t.t_number = b.table_number) WHERE b.date_booked_for = $1) ORDER BY t_number;', [date_booked_for]);
        // console.log(rows);
        res.status(200).send(rows);
    } catch(err) {
        next(err);
    }
}

const getBookingsNextNDays = async (req, res, next) => {
    const days = req.query.days || 7;
    try {
        // const {rowCount, rows} = await pool.query("SELECT ARRAY(select count FROM (select date_booked_for::date, count(id) as count from \"Booking\" WHERE (date_booked_for::date >= current_date::date and date_booked_for::date < current_date::date + make_interval(days => $1)) GROUP BY date_booked_for::date) AS foo) AS bookings;", [days]);
        const {rowCount, rows} = await pool.query("SELECT TO_CHAR(date_booked_for, 'DD Mon') as s, COUNT FROM (select date_booked_for::date, count(id) as count from \"Booking\" WHERE (date_booked_for::date >= current_date::date and date_booked_for::date < current_date::date + make_interval(days => $1)) GROUP BY date_booked_for::date) AS foo;", [days]);
        res.status(200).send({ rowCount, rows });
        } catch(err) {
        next(err);
    }
}

const getIncome = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT SUM (price) AS total FROM (SELECT mi.price * omi.quantity AS price FROM "Menu_item" mi  RIGHT JOIN "Order_menu_item" omi ON (mi.id = omi.menu_item_id)) AS sdf;');
    } catch(err) {
        next(err);
    }
}

const createBooking = async (req, res, next) => {
    try {
        // check if table is free at specified time
        const { rows } = await pool.query('SELECT COUNT(id) AS count FROM "Booking" WHERE date_booked_for = $1 AND table_number = $2;', [req.body.date_booked_for, req.body.table_number]);
        const count = parseInt(rows[0].count);
        if (count !== 0) {
            var err = new Error('Table already reserved');
            err.status = 403;
            next(err);
        }
        else {
            const rows = await pool.query('INSERT INTO "Booking" (table_number, customer_fname, customer_lname, customer_email, customer_phone_no, date_booked, date_booked_for, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8);', [req.body.table_number, req.body.customer_fname, req.body.customer_lname, req.body.customer_email, req.body.customer_phone_no, req.body.date_booked, req.body.date_booked_for, (req.body.status) ? req.body.status : "pending"]);
            res.status(200).send({message : 'Created successfully'});
        }
    } catch(err) {
        next(err);
    }
}

const getBookingsNumber = async (req, res, next) => {
    try {
        const { rows } = await pool.query('SELECT COUNT(b.id) AS total_bookings FROM "Booking" b;');
        res.status(200).send(rows[0]);
    } catch(err) {
        next(err);
    } 
}

const updateBooking = async (req, res, next) => {
    const { booking_id } = req.params;
    try {
        const { rows } = await pool.query('UPDATE "Booking" SET status = $1 WHERE id = $2 returning id;', [req.body.status, booking_id]);
        if (!rows[0]) {
            res.status(400).send({ error: 'Seems like such id doesn\'t exist'});
            return;
        }
        res.status(200);
        res.send({ message:'Updated successfully.', id: `${rows[0]["id"]}` }) ;
    } catch(err) {
        next(err);
    }
}

const deleteBooking = async (req, res, next) => {
    const { booking_id } = req.params;
    try {
        const { rows } = await pool.query('DELETE FROM "Booking" b WHERE b.id = $1 returning id;', [booking_id]);
        if (!rows[0]) {
            res.status(400).send({ error: 'Seems like such id doesn\'t exist'});
            return;
        }
        res.status(200);
        res.send({ message: 'Deleted successfully.', id: `${rows[0]["id"]}`});
    } catch(err) {
        next(err);
    }
}

// Menu
// if menu id not specified return last by id
const getMenu = async (req, res, next) => {
    var menu_id = req.params.menu_id;
    if (!menu_id) menu_id = (await pool.query('SELECT MAX(m.id) FROM "Menu" m;')).rows[0].max; // returns menu with max id, that is last one
    try {
        const { rowCount, rows } = await pool.query('SELECT * FROM "Menu_item" WHERE menu_id = $1 ORDER BY id;', [menu_id]);
        res.status(200).send({ rowCount, rows });
    } catch(err) {
        next(err);
    }
};


const createMenuItem = async (req, res, next) => {
    const params = req.body;
    var menu_id = params.menu_id;
    if (!menu_id) menu_id = (await pool.query('SELECT MAX(m.id) FROM "Menu" m;')).rows[0].max; // returns menu with max id, that is last one

    try {
        const rows = await pool.query('INSERT INTO "Menu_item" (menu_id, name, price, link, description) VALUES ($1, $2, $3, $4, $5);', [menu_id, params.name, params.price, params.link, params.description]);
        res.status(200).send({message : 'Created successfully'});
    } catch(err) {
        next(err);
    }
};

const getMenuItemById = async (req, res, next) => {
    const item_id = req.query.item_id;
    const menu_id = req.query.menu_id;
    try {
        const { rows }  = await pool.query('SELECT * FROM "Menu_item" WHERE id = $1 AND menu_id = $2;', [item_id, menu_id]);
        res.status(200).send(rows);
    } catch(err) {
        next(err);
    }
};


const deleteMenuItem = async (req, res, next) => {
    console.log(req.params);
    const params = req.params;
    var menu_id = params.menu_id;
    if (!menu_id) menu_id = (await pool.query('SELECT MAX(m.id) FROM "Menu" m;')).rows[0].max; // returns menu with max id, that is last one

    const item_id = req.params.item_id;
    try {
        const rows = await pool.query('DELETE FROM "Menu_item" WHERE menu_id = $1 AND id = $2;', [menu_id, item_id]);
    } catch(err) {
        next(err);
    }
};

module.exports = {
    getTraffic,
    updateTraffic,
    getBookings,
    getBookingById,
    createBooking,
    updateBooking,
    deleteBooking,
    getFreeTables,
    getIncome,
    getBookingsNextNDays,
    getBookingsNumber,
    getMenu,
    createMenuItem,
    getMenuItemById,
    deleteMenuItem,
}
