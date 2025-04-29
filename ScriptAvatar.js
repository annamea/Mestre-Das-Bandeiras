

const avatares = document.querySelectorAll('.avatar');

avatares.forEach(avatar => {
    avatar.addEventListener('click', function() {
        // Remove a seleção dos outros
        avatares.forEach(a => a.classList.remove('selecionado'));

        // Marca o que foi clicado
        this.classList.add('selecionado');
    });
});
