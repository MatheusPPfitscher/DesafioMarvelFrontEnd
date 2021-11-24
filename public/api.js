const api = axios.create({
    baseURL: 'https://api-desafiomarvel-matheuspp.herokuapp.com',
});

const notAvailable = ['http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg', 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif'];
const marvelLogo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1200px-Marvel_Logo.svg.png';

const personagensPorLinha = 12;
const linhasDePersonagem = 5;
const limiteRequisicao = personagensPorLinha * linhasDePersonagem; //limite resultados por requisição
const limitePaginas = 8;
const limiteDeComics = 8;
const larguraImagem = '125vw';
const alturaImagem = '125vh';

const params = new URLSearchParams(window.location.search);

const page = params.get('page') ? params.get('page') : '1';

function listaPersonagens() {
    const name = document.querySelector('#nomePersonagem').value;
    api.get('/', {
        params: {
            page,
            name,
            limit: limiteRequisicao,
        },
    })
        .then((result) => {
            const lista = result.data.data;
            atualizaTabela(lista);
        })
        .catch((err) => {
            alert(err);
            console.log(err);
            console.log(err.request);
            console.log(err.response);
        });
}

function carregaDetalhes() {
    const idPersonagem = params.get('characterId');
    console.log(idPersonagem);
    api.get(`/personagem/${idPersonagem}`)
        .then((result) => {
            console.log(result.data);
            console.log(result.data.comics);
            const detalhesDoPersonagem = result.data;
            atualizaDetalhes(detalhesDoPersonagem);
        })
        .catch((err) => {
            alert(err);
            console.log(err);
            console.log(err.request);
            console.log(err.response);
        });
}

function atualizaTabela(lista) {
    const tbodyLista = document.querySelector('#listaPersonagens');
    tbodyLista.innerHTML = '';
    counter = 0;
    console.log(lista);
    let limRow = Math.floor(lista.length / personagensPorLinha);
    console.log(limRow);
    let conteudo = '';
    for (let row = 0; row < limRow; row++) {
        conteudo += `<div class="d-flex justify-content-center m-1">`;
        for (let colum = 0; colum < personagensPorLinha; colum++) {
            personagem = lista[counter];
            if (notAvailable.includes(personagem.photo)) {
                personagem.photo = marvelLogo;
            }

            conteudo += `<a href="./detalhes.html?characterId=${personagem.id}"><img alt="${personagem.name}" title="${personagem.name}" height=${alturaImagem} width=${larguraImagem} src=${personagem.photo}></a>`;
            counter++;
        }
        conteudo += '</div>';
    }
    tbodyLista.innerHTML = conteudo;
}

function atualizaDetalhes(detalhesDoPersonagem) {
    nomePersonagem = document.querySelector('#nomePersonagem');
    nomePersonagem.innerHTML = detalhesDoPersonagem.name;

    descricaoPersonagem = document.querySelector('#descricaoPersonagem');
    if (detalhesDoPersonagem.description) {
        descricaoPersonagem.innerHTML = detalhesDoPersonagem.description;
    } else {
        descricaoPersonagem.innerHTML = 'Não informado.';
    }

    photoPersonagem = document.querySelector('#photoPersonagem');
    if (notAvailable.includes(detalhesDoPersonagem.photo)) {
        detalhesDoPersonagem.photo = marvelLogo;
    }
    photoPersonagem.innerHTML = `<img class="img-fluid" src="${detalhesDoPersonagem.photo}" alt="${detalhesDoPersonagem.name}" srcset="">`;

    listaDeComics = document.querySelector('#listaDeComics');
    let conteudo = '';
    let comicsInDisplay = 0;
    if (detalhesDoPersonagem.comics.length > 0) {
        while (comicsInDisplay < limiteDeComics) {
            let comic = detalhesDoPersonagem.comics[comicsInDisplay]
            if (comic) {
                conteudo += `<div class="d-flex flex-column ps-5"  style="width: 12vw;">`
                conteudo += `<img class="" src="${comic.photo}" alt="${comic.title}" srcset="">`;
                conteudo += `<p>${comic.title}</p>`;
                conteudo += "</div>"
                comicsInDisplay++
            } else break
        }
    } else { conteudo = `<p class="mx-auto"> Não há HQs (comics) deste personagem</p>` }

    listaDeComics.innerHTML = conteudo;

    let items = document.querySelectorAll('.carousel .carousel-item')
}

function atualizaPaginacao(paginaAtual) {
    listaPaginas = document.querySelector('#paginacao');
    let classPage = ""
    if (paginaAtual <= limitePaginas / 2) {
        for (let iteradorPagina = 1; iteradorPagina < limitePaginas; iteradorPagina++) {
            if (iteradorPagina == paginaAtual) classPage = "page-item active"
            else classPage = "page-item"
            listaPaginas.innerHTML += `<li class="${classPage}"><a class="page-link" href="?page=${iteradorPagina}">${iteradorPagina}</a></li>`;
        }
    } else {
        listaPaginas.innerHTML += `<li class="page-item"><a class="page-link" href="?page=${1}">Inicio</a></li>`;
        let limite = parseInt(paginaAtual) + limitePaginas / 2 + 1;
        for (let iteradorPagina = parseInt(paginaAtual) - (limitePaginas / 2 - 1); iteradorPagina < (limite - 1); iteradorPagina++) {
            if (iteradorPagina == paginaAtual) classPage = "page-item active"
            else classPage = "page-item"
            listaPaginas.innerHTML += `<li class="${classPage}"><a class="page-link" href="?page=${iteradorPagina}">${iteradorPagina}</a></li>`;
        }
    }
}

function iniciarPagina() {
    console.log(window.location.pathname);
    if (window.location.pathname == '/') {
        listaPersonagens();
        atualizaPaginacao(page);
    } else if (window.location.pathname == '/detalhes.html') {
        carregaDetalhes();
    }
}

function voltar() {
    window.location.href = './';
}
iniciarPagina();
