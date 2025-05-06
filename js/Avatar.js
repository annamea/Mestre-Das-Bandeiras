function escolherAvatar(avatarSrc) {

    localStorage.setItem("avatarUsuario", avatarSrc);


    const avatares = document.querySelectorAll('.avatar');
    avatares.forEach(avatar => {
        avatar.style.border = "none"; 
    });

    const avatarSelecionado = event.target.closest('.avatar');
    avatarSelecionado.style.border = "5px solid #7E9D7E"; 
}
