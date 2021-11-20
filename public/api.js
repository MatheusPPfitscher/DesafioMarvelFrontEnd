const api = axios.create({
    baseURL: "http://localhost:8081"
});

const notAvailable = "http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg"
const marvelLogo = "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1200px-Marvel_Logo.svg.png"
const limit = 50; //limite resultados por requisição
const personagensPorLinha = 8;
const limitePaginas = 8;

const params = new URLSearchParams(window.location.search);

const page = params.get("page")
    ? params.get("page")
    : "1";

function listaPersonagens() {
    const name = document.querySelector("#nomePersonagem").value
    api.get("/", {
        params: {
            page,
            name,
            limit
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

function carregaDetalhes() {
    const idPersonagem = params.get("characterId")
    console.log(idPersonagem);
    api.get(`/personagem/${idPersonagem}`)
        .then(result => {
            console.log(result);
            const detalhesDoPersonagem = result.data;
            atualizaDetalhes(detalhesDoPersonagem);
        })
        .catch(err => {
            alert(err)
            console.log(err)
            console.log(err.request);
            console.log(err.response);
        })
}

function atualizaTabela(lista) {
    const tbodyLista = document.querySelector("#listaPersonagens")
    tbodyLista.innerHTML = "";
    counter = 0;
    console.log(lista);
    let limRow = Math.floor(lista.length / personagensPorLinha)
    console.log(limRow);
    let conteudo = ""
    for (let row = 0; row < limRow; row++) {
        conteudo += `<div class="row  margin-y-auto">`
        for (let colum = 0; colum < personagensPorLinha; colum++) {
            personagem = lista[counter]
            if (personagem.photo == notAvailable) personagem.photo = marvelLogo
            conteudo += `<div class="col"><a href="./detalhes.html?characterId=${personagem.id}"><img alt="${personagem.name}" height=100 width = 100 src=${personagem.photo}></a></div>`
            counter++;
        }
        conteudo += "</div>"
    }
    tbodyLista.innerHTML = conteudo;
}

function atualizaDetalhes(detalhesDoPersonagem) {
    const name = detalhesDoPersonagem.name;
    console.log(name);
    const descrition = detalhesDoPersonagem.descrition;
    console.log(description);
}

function atualizaPaginacao(page) {
    listaPaginas = document.querySelector("#paginacao")
    if (page <= (limitePaginas / 2)) {
        for (let pagina = 1; pagina <= limitePaginas; pagina++) {
            listaPaginas.innerHTML += `<li class="page-item"><a class="page-link" href="?page=${pagina}">${pagina}</a></li>`
        }
    }
    else {
        listaPaginas.innerHTML += `<li class="page-item"><a class="page-link" href="?page=${1}">Inicio</a></li>`
        let limite = (parseInt(page) + limitePaginas / 2 + 1);
        for (let pagina = (parseInt(page) - (limitePaginas / 2 - 1)); (pagina < limite); pagina++) {
            listaPaginas.innerHTML += `<li class="page-item"><a class="page-link" href="?page=${pagina}">${pagina}</a></li>`
        }
    }
}

function iniciarPagina() {
    console.log(window.location.pathname)
    if (window.location.pathname == "/public/index.html") {
        listaPersonagens()
        atualizaPaginacao(page)
    }
    else if (window.location.pathname == "/public/detalhes.html") {
        carregaDetalhes()
    }

}

iniciarPagina()