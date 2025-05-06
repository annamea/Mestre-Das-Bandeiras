const socket = new WebSocket("ws://localhost:8080");

socket.onmessage = function (event) {
  const dados = JSON.parse(event.data);

  if (dados.tipo === "resultados") {
    const container = document.getElementById("podium-container");
    container.innerHTML = ""; // Limpa o conteúdo anterior

    const top3 = dados.ranking.slice(0, 3);
    const posicoes = ["first", "second", "third"];
    const medalhas = ["trofeu.png", "prata.png", "bronze.png"];

    const podiumDiv = document.createElement("div");
    podiumDiv.classList.add("podium");

    top3.forEach((jogador, index) => {
      const bloco = document.createElement("div");
      bloco.classList.add("place", posicoes[index]);

      bloco.innerHTML = `
        <div class="top-content">
          <span>${jogador.nome}</span>
          <img src="img/${medalhas[index]}" alt="${posicoes[index]} lugar">
        </div>
        <div class="podium-block ${posicoes[index]}-block">
          <p>Tempo: ${jogador.tempo ?? "N/A"}</p>
          <p>Pontos: ${jogador.pontos}</p>
          <img src="${jogador.avatar ?? 'img/avatarDefault.png'}" alt="Avatar" class="avatar">
        </div>
      `;

      podiumDiv.appendChild(bloco);
    });

    container.appendChild(podiumDiv);
  }
};
