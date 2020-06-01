"use strict"
let _capital;
let _precioDeCompra;
let _precioActual;
let _estrategia;
let debug = 0;
let _per;

function caluculadora(requestQuery) {

    let target = _precioActual;
    let recompensaServer, recompensapServer;

    if (requestQuery.name == Number(1)) {
        if (Number(target) < _precioDeCompra) { //largo en perdidas
            console.log("largo en perdidas");
            let percentage = ((Number(target) * 100) / Number(_precioDeCompra)).toFixed(2);
            let finalPercentage = Number(100 - Number(percentage));
            finalPercentage = finalPercentage.toFixed(2);
            recompensapServer = finalPercentage;

            recompensaServer = ((Number(requestQuery.ncap)) * (recompensapServer)) / 100;

            recompensapServer = Number(recompensapServer) * -1;
            recompensaServer = Number(recompensaServer) * -1;

        } else { //largo en ganancias
            console.log("largo en ganancias");
            let percentage = ((Number(target) * 100) / Number(_precioDeCompra)).toFixed(2);
            let finalPercentage = Number(Number(percentage) - 100);
            finalPercentage = finalPercentage.toFixed(2);
            recompensapServer = finalPercentage;

            recompensaServer = ((Number(requestQuery.ncap)) * (recompensapServer)) / 100;
        }
    } else {
        if (Number(target) > _precioDeCompra) { //corto en perdidas
            console.log("corto en perdidas");
            let percentage = ((Number(target) * 100) / Number(_precioDeCompra)).toFixed(2);
            let finalPercentage = Number(100 - Number(percentage));
            finalPercentage = finalPercentage.toFixed(2);
            recompensapServer = finalPercentage;

            recompensaServer = ((Number(requestQuery.ncap)) * (recompensapServer)) / 100;

            if (Number(recompensapServer) <= -100) {
                recompensaServer = (requestQuery.ncap * -1);
                recompensapServer = -100;
            }


        } else { //corto en ganancias
            console.log("corto en ganancias");
            let percentage = ((Number(target) * 100) / Number(_precioDeCompra)).toFixed(2);
            let finalPercentage = Number(Number(percentage) - 100);
            finalPercentage = finalPercentage.toFixed(2);
            recompensapServer = finalPercentage;

            recompensaServer = ((Number(requestQuery.ncap)) * (recompensapServer)) / 100;

            recompensapServer = Number(recompensapServer) * -1;
            recompensaServer = Number(recompensaServer) * -1;
        }
    }
    _per = recompensapServer;
    return recompensaServer;
}


function intervalo() {

    $.ajax({
        method: "GET",
        url: "/p",
        // En caso de éxito, mostrar el resultado
        // en el documento HTML
        success: function (data, textStatus, jqXHR) {
            console.log(textStatus);

            _precioActual = Number(data.result);

            if (debug == 0)
                console.log("Este es el precio actual: " + _precioActual);

            let _name = Number(0);
            if (_estrategia == 1 || _estrategia == 3) _name = Number(1);

            let parametros = {
                ncap: _capital,
                name: _name
            }
            console.log(parametros);
            let gpne = caluculadora(parametros);
            gpne = gpne.toFixed(2);
            let tot = Number(gpne) + Number(_capital);


            let updates = $("#actualizaciones").text();
            updates = Number(updates) + 1;

            if (Number(gpne) > 0) {
                $("#idcolor").css('color', 'green');
                $("#idcolor").text("Ganancias de " + _per + '%');
            }
            else {
                $("#idcolor").css('color', 'red');
                $("#idcolor").text("Pérdidas de " + _per + '%');
            }

            $("#idtot").text(tot + ' €');

            $("#idtc").text(tot + ' €');

            $("#idgpne").text(gpne + ' €');

            $("#actualizaciones").text(updates);

            $("#idper").text("Que actualmente te está proporcionando un    beneficio/perdida del " + _per + "%");

            $("#idpactual").text("Precio actual: " + _precioActual);

         

        },
        // En caso de error, mostrar el error producido
        error: function (jqXHR, textStatus, errorThrown) {
            alert("Se ha producido un error: " + errorThrown);
        }
    });
}


$(function () {
    console.log("ya me he cargado");
    _capital = $("#_icapital").text();
    _capital = Number(_capital);
    _precioDeCompra = $("#_iprecio").text();
    _precioDeCompra = Number(_precioDeCompra);
    _estrategia = $("#_iestr").text();
    _estrategia = Number(_estrategia);
    if (debug == 0) {
        console.log("precio de compra: " + _precioDeCompra);
        console.log("capital inicial: " + _capital);
        console.log("Esta es la estrategia: " + _estrategia);
    }


    intervalo();

    setInterval(() => intervalo(), 30000);

    setInterval(() => increment(), 1000);
    let is = 30;
    function increment() {
        is = Number(is)-1;
        $("#idis").text(is);
        if(is==0)is=30;
    }
  
});