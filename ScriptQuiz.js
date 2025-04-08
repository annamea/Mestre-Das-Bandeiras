document.addEventListener("DOMContentLoaded", function () {
    const inputResposta = document.querySelector(".resposta input");
    const botaoVerificar = document.querySelector(".resposta button");
    const flagImage = document.querySelector(".bandeira img");

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
    let correctAnswer = '';

    function normalizarTexto(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    }

    function obterBandeiraAleatoria() {
        if (paisesRestantes.length === 0) {
            paisesRestantes = [...paisesConhecidos]; 
        }

        const index = Math.floor(Math.random() * paisesRestantes.length);
        const pais = paisesRestantes.splice(index, 1)[0]; 

        correctAnswer = normalizarTexto(pais.name);
        flagImage.src = `https://flagcdn.com/w320/${pais.code}.png`;
    }

    function verificarResposta() {
        const respostaUsuario = normalizarTexto(inputResposta.value.trim());

        if (respostaUsuario === correctAnswer) {
            document.getElementById("popupAcerto").style.display = "block";
            document.getElementById("popupErro").style.display = "none";
        } else {
            document.getElementById("popupErro").style.display = "block";
            document.getElementById("popupAcerto").style.display = "none";
            document.getElementById("erroNomePais").innerHTML =
                `<strong>Resposta Correta:</strong><br>${correctAnswer.charAt(0).toUpperCase() + correctAnswer.slice(1)}`;
        }
    }

    document.getElementById("closePopupAcerto").addEventListener("click", () => {
        document.getElementById("popupAcerto").style.display = "none";
        inputResposta.value = "";
        obterBandeiraAleatoria();
    });

    document.getElementById("closePopupErro").addEventListener("click", () => {
        document.getElementById("popupErro").style.display = "none";
        inputResposta.value = "";
        obterBandeiraAleatoria();
    });

    botaoVerificar.addEventListener("click", verificarResposta);

    inputResposta.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            const popupAcerto = document.getElementById("popupAcerto");
            const popupErro = document.getElementById("popupErro");

            if (popupAcerto.style.display === "block") {
                document.getElementById("closePopupAcerto").click();
            } else if (popupErro.style.display === "block") {
                document.getElementById("closePopupErro").click();
            } else {
                verificarResposta();
            }
        }
    });

    obterBandeiraAleatoria();
});
