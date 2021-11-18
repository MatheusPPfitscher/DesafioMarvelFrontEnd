const api = axios.create({
    baseURL: "http://localhost:8081"
});

const limit = 50; //limite requisições

const limitePaginas = 10;

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

function atualizaTabela(lista) {
    const tbodyLista = document.querySelector("#listaPersonagens > tbody")
    tbodyLista.innerHTML = "";
    counter = 0;
    console.log(lista);
    let limRow = Math.floor(lista.length / 10)
    console.log(limRow);
    let conteudo = ""
    for (let row = 0; row < limRow; row++) {
        conteudo += "<tr>"
        for (let colum = 0; colum < 10; colum++) {
            personagem = lista[counter]
            conteudo += `<td><img alt="${personagem.name}" height=60 src=${personagem.photo}></td>`
            counter++;
        }
        conteudo += "</tr>"
    }
    tbodyLista.innerHTML = conteudo;
}

function atualizaPaginacao(page) {
    listaPaginas = document.querySelector("#paginacao")
    if (page <= (limitePaginas / 2)) {
        for (let pagina = 1; pagina <= limitePaginas; pagina++) {
            listaPaginas.innerHTML += `<li class="page-item"><a class="page-link" href="?page=${pagina}">${pagina}</a></li>`
        }
    }
    else {
        let limite = (parseInt(page) + limitePaginas / 2 + 1);
        for (let pagina = (parseInt(page) - (limitePaginas / 2 - 1)); (pagina < limite); pagina++) {
            listaPaginas.innerHTML += `<li class="page-item"><a class="page-link" href="?page=${pagina}">${pagina}</a></li>`
        }
    }
}

function iniciarPagina() {
    atualizaPaginacao(page)
    listaPersonagens()
}
// http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg
iniciarPagina()