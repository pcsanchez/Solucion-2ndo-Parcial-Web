function watchForm() {
    let form = $('.js-search-form');

    $(form).on('submit', (event) => {
        event.preventDefault();
        let country = $('.js-query').val();
        let url = `https://restcountries.eu/rest/v2/name/${country}?fullText=true`

        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            success: function(responseJSON) {
                displayResults(responseJSON);
            },
            error: function(error) {
                console.log(error);
                displayError();
            }
        })
    })
}

function displayResults(response){
    let container = $('.js-search-results');
    let result = response[0];
    $(container).empty();
    let targetHtml = `<ul>
    <li>Nombre: ${result.name}</li>
    <li>Capital: ${result.capital}</li>
    <li>Poblacion: ${result.population}</li>
    <li>Region: ${result.region}</li>
    <li><ul>Zonas Horarias:`;
    result.timezones.forEach((el) => {
        targetHtml+= `<li>${el}</li>`
    })
    targetHtml+=`</ul></li>`
    targetHtml+=`<li><ul> Paises colindantes:`
    result.borders.forEach(el => {
        targetHtml+= `<li>${el}</li>`;
    })
    targetHtml+=`</ul></li>`;
    targetHtml+=`</ul>`;
    targetHtml+=`<img src="${result.flag}" alt="country-flag">`
    $(container).append(targetHtml);
    
    
}

function displayError() {
    let container = $('.js-search-results');
    $(container).empty();
    $(container).append(`<p>Pais no existente</p>`);
}


function init() {
    watchForm();
};

init();