const express = require('express');

const router = express.Router();

const db = require('./queries'),
    jwt = require('../../utils/jwt');

// Needed for identifying mobile/non-mobile devices by request header  
const useragent = require('express-useragent');
router.use(useragent.express());

router.get('/', (req, res) => {
    res.status(200).send({ message: 'API is working!'});
});

// token authenticating middleware

// function authenticateToken (req, res, next)

router.get('/stats', db.getTraffic);

// Platforms statistics
router.use(db.updateTraffic);

router.get('/bookings/', (req, res) => {
    res.status(400).send({ error: 'Please, use bookings/page/page_number. Alternatively bookings/id to get data of one particular booking'})
});

router.get('/bookings/total', db.getBookingsNumber);
router.get('/bookings/next_days/', db.getBookingsNextNDays);
router.get('/bookings/page/:page?', jwt.authenticateToken, db.getBookings);    // Returns 15 with offset, represented by pages. If page is not specified, defaults to 1
router.get('/bookings/:booking_id', jwt.authenticateToken, db.getBookingById); // Returns data of one booking by id
router.post('/bookings/', db.createBooking);
router.put('/bookings/:booking_id', jwt.authenticateToken,db.updateBooking);
router.delete('/bookings/:booking_id', jwt.authenticateToken, db.deleteBooking);
router.get('/tables/free', db.getFreeTables);
router.get('/income', jwt.authenticateToken, db.getIncome);

router.get('/menu/:menu_id?', db.getMenu);
router.post('/menu/', jwt.authenticateToken, db.createMenuItem);
router.get('/menu/item/', db.getMenuItemById);
router.delete('/menu/:menu_id?/item/:item_id', jwt.authenticateToken, db.deleteMenuItem)

module.exports = router;
