let data = require('./colonia.json');
module.exports = (req, res) => {
    respuesta = {};
    // Creamos una copia de los datos ya que se filtrarán
    allColonias = JSON.parse(JSON.stringify(data));
    
    // Se filtran las colonias por ZipCode
    allColonias.result = allColonias.result.filter((c) => {
        return c.zipCode == req.body.zipCode;
    });

    // Si no hay colonias con ese ZIP entonces se manda un 202
    if(allColonias.result.length == 0){
        respuesta = require('../errors/nodata.json');
    } else {
        // Si se encuentran colonias se manda un 200 y el arreglo filtrado
        respuesta = allColonias;
    }
    
    res.send(respuesta);

}