let pais;
let bandeira;
let pais_br;
let rodadaAtual = 0;
let pontuacao = 0;
let tempo = 0;
let intervaloTimer;
let api = [];

const timerElemento = document.getElementById("timer");
const img = document.querySelector('.bandeira');
const frm = document.getElementById('input-resposta'); 
const botao = document.getElementById('btn-resposta');
const pontuacaoElemento = document.getElementById('pontuacao');
const nome_pais = document.getElementById('nome_pais'); 

// Iniciar tudo ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
    iniciarTimer();
    carregarAPI();
    const nome = localStorage.getItem("nome");
    if (nome) {
    }
});

//voltar nome
document.addEventListener("DOMContentLoaded", function () {
    const nomeSalvo = localStorage.getItem("nome");
    if (nomeSalvo) {
        document.getElementById("nomeUsuario").innerText = nomeSalvo;
    }
});

// Timer
function iniciarTimer() {
    intervaloTimer = setInterval(() => {
        tempo++;
        timerElemento.innerText = `Timer: ${tempo}`; 
    }, 1000);
}

function pararTimer() {
    clearInterval(intervaloTimer);
}

// Buscar API de bandeiras
function carregarAPI() {
    fetch('https://restcountries.com/v2/all')
        .then(response => response.json())
        .then(data => {
            api = data;
            sortPais();
        })
        .catch(error => console.error("Erro ao carregar API:", error));
}

// Sorteia um novo país
function sortPais() {    
    const paisAleatorio = api[Math.floor(Math.random() * api.length)];
    pais = paisAleatorio.name;
    bandeira = paisAleatorio.flags.png;
    pais_br = paisAleatorio.translations.pt || paisAleatorio.name;

    img.src = bandeira;
    nome_pais.innerText = "";
}

// Verificar resposta
botao.addEventListener("click", () => {
    const resposta_pais = frm.value.trim();

    if (rodadaAtual < 10) {
        if (resposta_pais.toLowerCase() === pais_br.toLowerCase()) {
            pontuacao += 10;

            // Mostrar popup de acerto
            document.getElementById("popupAcerto").style.display = "block";

            // Esperar clique em "Continuar"
            document.getElementById("closePopupAcerto").onclick = () => {
                document.getElementById("popupAcerto").style.display = "none";

                pontuacaoElemento.innerText = `Pontos: ${pontuacao}`;
                frm.value = "";
                rodadaAtual++;

                if (rodadaAtual < 10) {
                    sortPais();
                } else {
                    finalizarJogo();
                }
            };

        } else {
            pontuacao -= 5;

            // Mostrar popup de erro com nome do país correto
            document.getElementById("erroNomePais").innerHTML = `<strong>Resposta Correta:</strong><br>${pais_br}`;
            document.getElementById("popupErro").style.display = "block";

            // Esperar clique em "Continuar"
            document.getElementById("closePopupErro").onclick = () => {
                document.getElementById("popupErro").style.display = "none";

                pontuacaoElemento.innerText = `Pontos: ${pontuacao}`;
                frm.value = "";
                rodadaAtual++;

                if (rodadaAtual < 10) {
                    sortPais();
                } else {
                    finalizarJogo();
                }
            };
        }
    }
});


// Finalizar jogo
function finalizarJogo() {
    pararTimer();
    const nome = localStorage.getItem("nome");
    if (nome) {
        enviarDadosParaServidor(nome, pontuacao, tempo);
    }
    window.location.href = "podio.html";
}

// Enviar dados para servidor
function enviarDadosParaServidor(nome, pontos, tempo) {
    const url = `http://127.0.0.1:1880/resposta?usuario=${encodeURIComponent(nome)}&pontuacao=${pontos}&segundos=${tempo}`;

    fetch(url)
        .then(response => {
            if (response.ok) {
                console.log("Dados enviados com sucesso!");
            } else {
                console.error("Erro ao enviar dados para o servidor.");
            }
        })
        .catch(error => {
            console.error("Erro na requisição:", error);
        });
}

 