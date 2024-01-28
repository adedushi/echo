const express = require('express');
const router = express.Router();

/* GET echos listing. */
router.get('/', function (req, res, next) {
    res.json({
        message: "GET /api/echos"
    });
});

module.exports = router;