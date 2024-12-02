document.addEventListener('DOMContentLoaded', function () {
    const settingsIcon = document.getElementById('settingsIcon');
    const settingsMenu = document.getElementById('settingsMenu');

    // Mostrar o menu quando o mouse está sobre o ícone
    settingsIcon.addEventListener('mouseover', function () {
        settingsMenu.style.display = 'block';
    });

    // Ocultar o menu quando o mouse sai do ícone e do menu
    settingsIcon.addEventListener('mouseout', function (event) {
        if (!settingsMenu.matches(':hover')) {
            settingsMenu.style.display = 'none';
        }

    });

    settingsMenu.addEventListener('mouseover', function () {
        settingsMenu.style.display = 'block';
    });

    settingsMenu.addEventListener('mouseout', function (event) {
        settingsMenu.style.display = 'none';
    });
});
