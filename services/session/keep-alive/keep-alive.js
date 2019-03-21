module.exports = (req, res) => {
    let token = "Bearer eyJhbGciOiJIUzUxMiJ9.";
    let expiracion = (new Date().valueOf()) / 1000 + 120;
    let jsonToken = {
        "sub": "6",
        "iat": 1539903068,
        "exp": expiracion,
        "name": "Luis Gonzalez StratPlus",
        "username": "lgonzalez"
    }

    
    token += Buffer.from(JSON.stringify(jsonToken)).toString('base64') +'.';
    token += "89D8duaBMvsg5X6e8YsyPrz_N-C9bDhT0vKxGGG0uKOyexGPAqh0QlKJ7YyIefVVeUfcTpqgNX3gAh4IPX207g";

    res.set('Authorization', token);
    res.set('Access-Control-Expose-Headers', 'Authorization, Date')
    res.status(200).send({mensaje: "Sessión actualizada correctamente"});
}