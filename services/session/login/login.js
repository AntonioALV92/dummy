// const broker = require('./responseBroker.json');
// const inq = require('./responseInquilino.json');
module.exports = (req, res) => {
    // const email = req.body.username;

    // const data = email == 'broker@strat.net' ? broker : inq;

    let token = "Bearer eyJhbGciOiJIUzUxMiJ9.";
    token += "89D8duaBMvsg5X6e8YsyPrz_N-C9bDhT0vKxGGG0uKOyexGPAqh0QlKJ7YyIefVVeUfcTpqgNX3gAh4IPX207g";

    res.set('Authorization', token);
    res.set('Access-Control-Expose-Headers', 'Authorization, Date');
    res.status(200).send({});
}