var campoTextoEmail = document.getElementById('emailCodigoEsqueceuSenha');
var campoCodigo = document.getElementById('verificacao');
var tituloPagina = document.getElementById('tituloPagina');
var botaoEnviar = document.getElementById('botaoEnviar');
var aEnviar = document.getElementById('botaoEnviarEmail');
var enviarCodigo = document.getElementById('botaoVerificaCodigo');
var codigo;

var sectionEnviarEmail = document.getElementById('sectionEnviarEmail');
var sectionVerificarCodigo = document.getElementById('sectionVerificarCodigo');

var resultadoVerificacaoEmail = true;

function cliqueBotaoEnviar() {

    //Colocar Logica de Verificacao com Servidor e Banco de Dados do Email
    if (campoTextoEmail.value != '' && campoTextoEmail.value.includes("@gmail.com")) {
        if (resultadoVerificacaoEmail) {

            sectionEnviarEmail.style.display = 'none';
            aEnviar.style.display = 'none';
            sectionVerificarCodigo.style.display = 'block';
            enviarCodigo.style.display = 'block';

        } else {
            alert('Email não reconhecido no Sistema!');
            campoTextoEmail.value = ''; //testar
        }
    } else {
        alert('Campo de Email vazio ou fora dos padrões @gmail.com!');
    }
}

function cliqueBotaoVerificaCodigo() {
    //Logica de Verificacao do CodigoEnviado

    if (codigo == campoCodigo.value) {
        window.location = "esqueceu_senhaTela.php";
    } else {
        alert('Código Incorreto!');
    }
}

// Inicia o EmailJS com o seu user ID
(function () {
    emailjs.init("9iqoer38dXhDwwn_a");
})();

// Função para enviar e-mail
async function enviarEmail(emailUsuario, codigoPHP) {
    
    //parâmetros do serviço de envio de email
    const templateParams = {
        user_email: emailUsuario,
        codigo: codigoPHP,
        to_name: emailUsuario,
        from_name: 'redaquick@gmail.com',
    };

    //configuração dos serviços 
    await emailjs.send('service_beqdydp', 'template_6z6gnr6', templateParams)
        .then(function (response) {
            window.location = '../view/codigo_esqueceu_senha.php';
        }, function (error) {
            console.log(error);
            alert('verifique sua conexão ou sua chave', error);
        });
}
