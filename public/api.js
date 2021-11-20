const api = axios.create({
   baseURL: 'http://localhost:8081',
});
// comentario

const notAvailable = ['http://i.annihil.us/u/prod/marvel/i/mg/b/40/image_not_available.jpg', 'http://i.annihil.us/u/prod/marvel/i/mg/f/60/4c002e0305708.gif'];
const marvelLogo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/Marvel_Logo.svg/1200px-Marvel_Logo.svg.png';

const personagensPorLinha = 10;
const linhasDePersonagem = 8;
const limiteRequisicao = personagensPorLinha * linhasDePersonagem; //limite resultados por requisição
const limitePaginas = 8;
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

         conteudo += `<a href="./detalhes.html?characterId=${personagem.id}"><img alt="${personagem.name}" height=${alturaImagem} width=${larguraImagem} src=${personagem.photo}></a>`;
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
   photoPersonagem.innerHTML = `<img src="${detalhesDoPersonagem.photo}" alt="${detalhesDoPersonagem.name}" srcset="">`;

   listaDeComics = document.querySelector('#listaDeComics');
   let conteudo = '';
   for (comic of detalhesDoPersonagem.comics) {
      conteudo += `<img src="${comic.photo}" alt="${comic.title}" srcset="">`;
      conteudo += `<p>${comic.title}</p>`;
   }
   listaDeComics.innerHTML = conteudo;
}

function atualizaPaginacao(page) {
   listaPaginas = document.querySelector('#paginacao');
   if (page <= limitePaginas / 2) {
      for (let pagina = 1; pagina <= limitePaginas; pagina++) {
         listaPaginas.innerHTML += `<li class="page-item"><a class="page-link" href="?page=${pagina}">${pagina}</a></li>`;
      }
   } else {
      listaPaginas.innerHTML += `<li class="page-item"><a class="page-link" href="?page=${1}">Inicio</a></li>`;
      let limite = parseInt(page) + limitePaginas / 2 + 1;
      for (let pagina = parseInt(page) - (limitePaginas / 2 - 1); pagina < limite; pagina++) {
         listaPaginas.innerHTML += `<li class="page-item"><a class="page-link" href="?page=${pagina}">${pagina}</a></li>`;
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
   window.location.href = './index.html';
}
iniciarPagina();
