
document.addEventListener("DOMContentLoaded", function () {
    conectarWebSocket();

    const inputResposta = document.getElementById("resposta");
    const botaoVerificar = document.getElementById("verificar");
    const flagImage = document.getElementById("bandeiraImagem");
    const popupAcerto = document.getElementById("popupAcerto");
    const popupErro = document.getElementById("popupErro");
    const erroNomePais = document.getElementById("erroNomePais");
    const contador = document.getElementById("contador");
    const pontosSpan = document.getElementById("pontuacaoTotal");
    const nomeUsuarioSpan = document.getElementById("nomeUsuario");
    const numeroRodada = document.getElementById("numero-rodada");

    const paisesConhecidos = [
        { code: "br", name: "Brasil" },
        { code: "us", name: "Estados Unidos" },
        { code: "fr", name: "França" },
        { code: "de", name: "Alemanha" },
        { code: "it", name: "Itália" },
        { code: "es", name: "Espanha" },
        { code: "jp", name: "Japão" },
        { code: "kr", name: "Coreia do Sul" },
        { code: "cn", name: "China" },
        { code: "gb", name: "Reino Unido" },
        { code: "ca", name: "Canadá" },
        { code: "mx", name: "México" },
        { code: "ar", name: "Argentina" },
        { code: "au", name: "Austrália" },
        { code: "ru", name: "Rússia" },
        { code: "pt", name: "Portugal" },
        { code: "in", name: "Índia" },
        { code: "za", name: "África do Sul" },
        { code: "eg", name: "Egito" },
        { code: "se", name: "Suécia" }
    ];

    let paisesRestantes = [...paisesConhecidos];
    let correctAnswer = "";
    let correctAnswerOriginal = "";
    let tempoRestante = 40;
    let intervaloTempo;
    let intervaloRodada;
    let tempoRodadaRestante = 40;
    let rodadaAtual = 1;
    const totalRodadas = 10;
    let bandeirasNaRodada = 1;
    let pontos = 0;
    let respostaRegistrada = false;

    function normalizarTexto(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function atualizarPontos(valor) {
        pontos += valor;
        pontosSpan.textContent = pontos;
    }

    function atualizarRodadaETempo() {
        numeroRodada.textContent = `${rodadaAtual}/${totalRodadas}`;
    }

    function iniciarRodada() {
        tempoRodadaRestante = 40;
        bandeirasNaRodada = 1;
        atualizarRodadaETempo();
        clearInterval(intervaloRodada);
        intervaloRodada = setInterval(() => {
            tempoRodadaRestante--;
            atualizarRodadaETempo();
            if (tempoRodadaRestante <= 0) {
                clearInterval(intervaloRodada);
                if (popupAcerto.style.display === "none" && popupErro.style.display === "none") {
                    mostrarPopupErro();
                }
                avançarRodada();
            }
        }, 1000);
    }

    function reiniciarTemporizador() {
        clearInterval(intervaloTempo);
        tempoRestante = 40;
        contador.textContent = tempoRestante;

        intervaloTempo = setInterval(() => {
            tempoRestante--;
            contador.textContent = tempoRestante;
            if (tempoRestante <= 0) {
                mostrarPopupErro();
            }
        }, 1000);
    }

    function obterBandeiraAleatoria() {
        if (paisesRestantes.length === 0) {
            paisesRestantes = [...paisesConhecidos];
        }
        const index = Math.floor(Math.random() * paisesRestantes.length);
        const pais = paisesRestantes.splice(index, 1)[0];

        correctAnswer = normalizarTexto(pais.name);
        correctAnswerOriginal = pais.name;
        flagImage.src = `https://flagcdn.com/w320/${pais.code}.png`;

        respostaRegistrada = false;
        reiniciarTemporizador();
    }

    function mostrarPopupAcerto() {
        if (respostaRegistrada) return;
        respostaRegistrada = true;

        popupAcerto.style.display = "block";
        popupErro.style.display = "none";
        atualizarPontos(5);
        clearInterval(intervaloTempo);
    }

    function mostrarPopupErro() {
        if (respostaRegistrada) return;
        respostaRegistrada = true;

        popupErro.style.display = "block";
        popupAcerto.style.display = "none";
        erroNomePais.innerHTML = `<strong>Resposta Correta:</strong><br>${correctAnswerOriginal}`;
        atualizarPontos(-5);
        clearInterval(intervaloTempo);
    }

    function verificarResposta() {
        const respostaUsuario = normalizarTexto(inputResposta.value.trim());
        if (respostaUsuario === correctAnswer) {
            mostrarPopupAcerto();
        } else {
            mostrarPopupErro();
        }
    }

    function avançarRodada() {
        bandeirasNaRodada--;
        if (bandeirasNaRodada <= 1) {
            rodadaAtual++;
            if (rodadaAtual <= totalRodadas) {
                obterBandeiraAleatoria();
                iniciarRodada();
            } else {
                clearInterval(intervaloRodada);
                enviarResultados();
            }
        } else {
            obterBandeiraAleatoria();
        }
    }

    botaoVerificar.addEventListener("click", verificarResposta);

    inputResposta.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            if (popupAcerto.style.display === "block") {
                document.getElementById("closePopupAcerto").click();
            } else if (popupErro.style.display === "block") {
                document.getElementById("closePopupErro").click();
            } else {
                verificarResposta();
            }
        }
    });

    document.getElementById("closePopupAcerto").addEventListener("click", () => {
        popupAcerto.style.display = "none";
        inputResposta.value = "";
        avançarRodada();
    });

    document.getElementById("closePopupErro").addEventListener("click", () => {
        popupErro.style.display = "none";
        inputResposta.value = "";
        avançarRodada();
    });

    obterBandeiraAleatoria();
    iniciarRodada();

    const nome = localStorage.getItem("nomeUsuario");
    const avatar = localStorage.getItem("avatarUsuario");

    if (nome) {
        nomeUsuarioSpan.textContent = nome;
    }

    if (avatar) {
        document.getElementById("avatarUsuario").src = avatar;
    }
});

window.addEventListener("load", function () {
    const nome = localStorage.getItem("nomeUsuario");

    if (nome) {
        document.getElementById("nomeUsuario").textContent = nome;
    }
});

window.onload = function () {
    const avatarUsuario = localStorage.getItem("avatarUsuario");

    if (avatarUsuario) {
        const avatarImagem = document.getElementById("avatarImagem");
        avatarImagem.src = avatarUsuario;

        avatarImagem.style.width = '55px';
        avatarImagem.style.height = '55px';
        avatarImagem.style.objectFit = 'cover';
    } else {
        console.log("Nenhum avatar selecionado.");
    }
};

let socket;

function conectarWebSocket() {
    socket = new WebSocket("ws://localhost:8080");

    socket.addEventListener("open", () => {
        console.log("Conectado ao servidor.");
        const nome = localStorage.getItem("nomeUsuario");
        const avatar = localStorage.getItem("avatarUsuario");
        socket.send(JSON.stringify({
            tipo: "registro",
            nome: nome,
            avatar: avatar,
            pontos: 0
        }));
    });

    socket.addEventListener("close", () => {
        console.log("Desconectado do servidor.");
    });

    socket.addEventListener("error", (error) => {
        console.error("Erro no WebSocket:", error);
    });
}

function enviarResultados() {
    const nome = localStorage.getItem("nomeUsuario");

    if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({
            tipo: "finalizado",
            nome: nome,
            pontos: pontos
        }));

        window.location.href = "Podio.html";
    } else {
        socket.addEventListener("open", () => {
            socket.send(JSON.stringify({
                tipo: "finalizado",
                nome: nome,
                pontos: pontos
            }));

            window.location.href = "Podio.html";
        });
    }
}

// Definir o número total de rodadas
let rodadaAtual = 1;
const totalRodadas = 10;

// Selecionar elementos HTML relevantes
const numeroRodadaElement = document.getElementById('numero-rodada');
const popupAcerto = document.getElementById('popupAcerto');
const popupErro = document.getElementById('popupErro');
const closePopupAcerto = document.getElementById('closePopupAcerto');
const closePopupErro = document.getElementById('closePopupErro');

// Função para iniciar a próxima rodada
function proximaRodada() {
    console.log("rodada atual " + rodadaAtual + " total " + totalRodadas);
    if (rodadaAtual < totalRodadas) {
        numeroRodadaElement.innerHTML = `Rodada: ${rodadaAtual}/10`;
        rodadaAtual++;
    }

    // Se atingir a 10ª rodada, redirecionar para a página do pódio
    if (rodadaAtual >= 1) {
        setTimeout(function () {
            window.location.href = 'Podio.html'; // Redireciona para o pódio
        }, 1000);
    }
}

// Simulação do botão "Verificar"
document.getElementById('verificar').addEventListener('click', function () {
    let respostaCorreta = true; // Simulação

    if (respostaCorreta) {
        popupAcerto.style.display = 'block';
        closePopupAcerto.addEventListener('click', function () {
            popupAcerto.style.display = 'none';
            proximaRodada();
        });
    } else {
        popupErro.style.display = 'block';
        closePopupErro.addEventListener('click', function () {
            popupErro.style.display = 'none';
            proximaRodada();
            console.log("proxima");
        });
    }
});

console.log("proxima");

