module.exports = (req, res) => {
    let token = "Bearer eyJhbGciOiJIUzUxMiJ9.";
    let expiracion = (new Date().valueOf()) / 1000 + 5000;
    let jsonToken = {
        "sub": "6",
        "iat": 1539903068,
        "exp": expiracion,
        "name": "Biometricos",
        "username": "lgonzalez"
    }


    token += Buffer.from(JSON.stringify(jsonToken)).toString('base64') + '.';
    token += "89D8duaBMvsg5X6e8YsyPrz_N-C9bDhT0vKxGGG0uKOyexGPAqh0QlKJ7YyIefVVeUfcTpqgNX3gAh4IPX207g";

    res.set('Authorization', token);
    res.set('Access-Control-Expose-Headers', 'Authorization, Date')
    res.status(200).send({
        "id": 6,
        "usuario": "lgonzalez",
        "nombre": "Biométricos",
        "correo": "capacitacion@gib.net",
        "movilAsignado": 0,
        "status": 1,
        "idDaon": 0,
        "resetPassword": true,
        "sucursal": "SUCURSAL TECAMACHALCO",
        "solicitud_reset_password": false,
        "permisos": {
            "key": 3,
            "webValidacion": true,
            "webVerificacion": true,
            "movilVerificacion": true,
            "movilConsultaOperaciones": true,
            "altaOperadores": true,
            "webAutenticacion": true,
            "webRegistro": true,
            "webReportes": true,
            "movilAltaVer2AutoCentralVerificadores": true
        }
    });
}