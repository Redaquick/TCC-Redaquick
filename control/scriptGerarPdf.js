let qrCodeUrls = []; // Vetor para armazenar os URLs dos QR codes
let qrCodeInfos = []; // Vetor para armazenar as informações de nome e turma
let imagemBase64 = ''; // Variável para armazenar a imagem em base64
var idAtividade;
var idInstituicao;
var dadosQR;
var file = null;
var receberArquivo = null;
var vetorNomeAlunos = [];
var vetorRaAlunos = [];

var nomeAtividadeCampo = document.getElementById('nomeAtividade').value;

// Função para converter a imagem selecionada pelo usuário em base64
function converterImagem() {
    receberArquivo = document.getElementById("imagem-usuario").files;
    if (receberArquivo.length > 0) {
        const carregarImagem = receberArquivo[0];
        const lerArquivo = new FileReader();

        lerArquivo.onload = function (arquivoCarregado) {
            imagemBase64 = arquivoCarregado.target.result;
        }

        lerArquivo.readAsDataURL(carregarImagem);
    }
}

// Evento para quando o arquivo Excel é selecionado
document.getElementById('fileInput').addEventListener('change', function (event) {
    file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            // Ler o arquivo Excel e converter para JSON
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // Iterar sobre todas as planilhas do arquivo Excel
            dadosQR = [];
            workbook.SheetNames.forEach(sheetName => {
                const worksheet = workbook.Sheets[sheetName];
                const sheetData = XLSX.utils.sheet_to_json(worksheet);
                dadosQR = dadosQR.concat(sheetData);
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

async function salvarAlunosPHP(nomeAluno, raAluno) {
    const dados = {
        nome: nomeAluno,
        RA: raAluno
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP
        const response = await fetch('https://feiratec.dev.br/redaquick/control/salvar_alunos_gerarPdf.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados) // Converte os dados para JSON e os envia no corpo da requisição
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }

        const resultadoEnvioPHP = await response.json();
        console.log(resultadoEnvioPHP);

    } catch (error) {
        console.error('Erro:', error);
    }
}

// Função para gerar QR codes a partir dos dados do arquivo Excel
async function gerarQRCodes(dados) {
    const container = document.getElementById('qrCodes');
    container.innerHTML = ''; // Limpa o conteúdo existente
    qrCodeUrls = []; // Limpa o vetor existente
    qrCodeInfos = []; // Limpa o vetor existente

    // Capturar valores do select e do campo de texto
    var trimestreSelecionado = document.getElementById('trimestre').value;
    var anoVigente = new Date().getFullYear();

    // Gerar QR codes para cada linha
    dados.forEach((linha) => {
        // Concatenar RA, nome extraído, turma e trimestre para gerar o QR code
        const textoQRCode = `${linha.RA}|${linha.Turma}|${trimestreSelecionado}|${anoVigente}|${idAtividade}|${idInstituicao}`;

        vetorRaAlunos.push(linha.RA);
        vetorNomeAlunos.push(linha.Nome);

        // Gerar o QR Code
        QRCode.toDataURL(textoQRCode, { width: 200 }, function (err, url) {
            if (err) {
                console.error('Erro ao gerar QR Code:', err);
                return;
            }
            qrCodeUrls.push(url); // Armazena o URL do QR code no vetor
            qrCodeInfos.push({
                nome: linha.Nome, // Armazena o nome extraído
                turma: linha.Turma || 'N/A',
                trimestre: trimestreSelecionado || 'N/A',
                ano: anoVigente
            }); // Armazena as informações de nome e turma
        });
    });
    await salvarAlunosPHP(vetorNomeAlunos, vetorRaAlunos);
}

// Função para gerar um único PDF com todas as páginas
async function gerarPDFs() {
    if (file != null && receberArquivo != null && nomeAtividadeCampo.value != null) {
        // Esperar que os dados de QR code sejam enviados e gerados
        await enviarDadosQrCodePHP();

        // Após a execução do fetch, agora gerar QR codes
        gerarQRCodes(dadosQR);

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const { Promise } = window; // Para garantir compatibilidade com `Promise.all`
        // Capturar valores do select e do campo de texto
        var trimestreSelecionado = document.getElementById('trimestre').value;
        var anoVigente = new Date().getFullYear();

        // Criação de uma lista de promessas para gerar PDFs e adicionar as páginas ao PDF principal
        const pdfPromises = qrCodeUrls.map(async (qrCodeUrl, index) => {
            return new Promise((resolve) => {
                if (index > 0) {
                    doc.addPage(); // Adiciona uma nova página para cada QR code, exceto a primeira
                }

                // Adicionar imagem enviada pelo usuário ao PDF, se disponível
                if (imagemBase64) {
                    doc.addImage(imagemBase64, 'JPEG', 0, 0, 220, 300);
                }

                // Adicionar QR code ao PDF
                doc.addImage(qrCodeUrl, 'PNG', 163, 5, 40, 40);

                // Adicionar informações de nome, turma, trimestre e ano ao PDF
                const info = qrCodeInfos[index];
                doc.setFontSize(14);
                doc.text(`${info.nome}`, 30, 56);
                doc.text(`${info.turma}`, 177, 56);
                doc.text(`${trimestreSelecionado}`, 113, 28);
                doc.text(`${anoVigente}`, 144, 28);

                resolve(); // Resolve a promessa após adicionar a página ao PDF
            });
        });

        // Aguarda a conclusão de todas as promessas
        await Promise.all(pdfPromises);

        // Gerar o PDF como um blob e oferecer o download
        const pdfBlob = doc.output('blob');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(pdfBlob);
        link.download = 'Folha de Redações-Avaliação Global.pdf';
        link.click();
    } else {
        alert(`Existem campos vazios. Preencha todos!`);
    }
}

// Função para enviar dados para o PHP e obter idAtividade e idInstituicao
async function enviarDadosQrCodePHP() {
    const dados = {
        nomeAtividade: nomeAtividadeCampo
    };

    try {
        // Fazendo a requisição com fetch e aguardando a resposta do PHP
        const response = await fetch('https://feiratec.dev.br/redaquick/control/dados_qrcode.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados) // Converte os dados para JSON e os envia no corpo da requisição
        });

        if (!response.ok) {
            throw new Error('Erro na requisição: ' + response.statusText);
        }

        const resultadoEnvioPHP = await response.json(); // Extrai e converte o corpo da resposta para JSON

        // Atribuindo os valores de idAtividade e idInstituicao
        idAtividade = resultadoEnvioPHP.id_atividade;
        idInstituicao = resultadoEnvioPHP.id_instituicao;
        console.log(`idAtividade: ${idAtividade}, idInstituicao: ${idInstituicao}`);

    } catch (error) {
        console.error('Erro:', error);
    }
}