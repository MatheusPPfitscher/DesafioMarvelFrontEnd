const api = axios.create({
    baseURL: "http://localhost:8081"
});

const params = new URLSearchParams(window.location.search);

const page = params.get("page")
    ? params.get("page")
    : "1";


function listaPersonagens() {
    const name = document.querySelector("#nomePersonagem").value
    api.get("/", {
        params: {
            page,
            name
        }
    })
        .then(result => {
            const lista = result.data.data;
            atualizaTabela(lista);
        })
        .catch(err => {
            alert(err)
            console.log(err)
            console.log(err.request);
            console.log(err.response);
        })
}

function atualizaTabela(lista) {
    const tbodyLista = document
        .querySelector("#listaPersonagens > tbody")
    tbodyLista.innerHTML = "";
    for (let personagem of lista) {
        tbodyLista.innerHTML += `<tr>
        <td>${personagem.id}</td>
        <td>${personagem.name}</td>
        <td> <img alt="${personagem.name}" height=60 src=${personagem.photo}
        </tr>`
    }
}
// http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg
listaPersonagens();