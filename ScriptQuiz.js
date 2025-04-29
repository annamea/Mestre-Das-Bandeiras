document.addEventListener("DOMContentLoaded", function () {
    const inputResposta = document.getElementById("resposta");
    const botaoVerificar = document.getElementById("verificar");
    const flagImage = document.getElementById("bandeiraImagem");
    const popupAcerto = document.getElementById("popupAcerto");
    const popupErro = document.getElementById("popupErro");
    const erroNomePais = document.getElementById("erroNomePais");
    const contador = document.getElementById("contador");
    const pontosSpan = document.getElementById("pontuacaoTotal");
    const nomeUsuarioSpan = document.getElementById("nomeUsuario");
    const tempoRodadaSpan = document.getElementById("tempo-rodada-restante");
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
    const totalRodadas = 20;
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
        let minutos = Math.floor(tempoRodadaRestante / 60);
        let segundos = tempoRodadaRestante % 60;
        tempoRodadaSpan.textContent = `${minutos}:${segundos < 10 ? '0' : ''}${segundos}`;
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
        atualizarPontos(5); // Adiciona 5 pontos por acerto
        clearInterval(intervaloTempo); 
    }

    function mostrarPopupErro() {
        if (respostaRegistrada) return;
        respostaRegistrada = true;

        popupErro.style.display = "block";
        popupAcerto.style.display = "none";
        erroNomePais.innerHTML = `<strong>Resposta Correta:</strong><br>${correctAnswerOriginal}`;
        atualizarPontos(-5); // Subtrai 5 pontos por erro
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
                window.location.href = "IndexCarregando.html"; 
            }
        } else {
            obterBandeiraAleatoria();
        }
    }

    // Eventos
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
        avançarRodada(); // Avança para a próxima bandeira após fechar o popup de acerto
    });

    document.getElementById("closePopupErro").addEventListener("click", () => {
        popupErro.style.display = "none";
        inputResposta.value = "";
        avançarRodada(); // Avança para a próxima bandeira após fechar o popup de erro
    });

    const nomeSalvo = localStorage.getItem("nomeUsuario");
    nomeUsuarioSpan.textContent = nomeSalvo || "Convidado";

    obterBandeiraAleatoria();
    iniciarRodada();
});
