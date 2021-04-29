const router = require("express").Router();

router.get("/", (req, res, next) => {
    res.render("soon");
});

module.exports = router;