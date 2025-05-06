function salvarNome() {
    const nome = document.getElementById("username").value;
    if (nome) {
        localStorage.setItem("nomeUsuario", nome); 
        window.location.href = "avatar.html"; 
    } else {
        alert("Por favor, digite um nome!");
    }
}
