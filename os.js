/* ===============================
   NUMERAÇÃO AUTOMÁTICA
   =============================== */
function proximaOC() {
    let numero = localStorage.getItem("numeroOC");
    if (!numero) numero = 2000;
    numero = parseInt(numero) + 
    localStorage.setItem("numeroOC", numero);
    return numero;
}

// Função que estava faltando e impedia a OS de gerar
function proximaOS() {
    let numero = localStorage.getItem("numeroOS");
    if (!numero) numero = 1000; // Começa em 1000
    numero = parseInt(numero) + 1;
    localStorage.setItem("numeroOS", numero);
    return numero;
}

/* ===============================
   FORMATA DATA
   =============================== */
function formatarDataOS(dataISO) {
    if (!dataISO) return "";
    const p = dataISO.split("-");
    return `${p[2]}/${p[1]}/${p[0]}`;
}

/* ===============================
   GERAR ORDEM DE SERVIÇO (PDF)
   =============================== */
function gerarOS() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const numeroOS = proximaOS();

    const data = formatarDataOS(document.getElementById("osData").value);
    const cliente = document.getElementById("osCliente").value;
    const telefone = document.getElementById("osTelefone").value;
    const cpf = document.getElementById("osCpf").value;

    const equipamento = document.getElementById("osEquipamento").value;
    const imei = document.getElementById("osImei").value;
    const senha = document.getElementById("osSenha").value;
    const observacoes = document.getElementById("osObs").value;

    const valor = document.getElementById("osValor").value;
    const pagamento = document.getElementById("osPagamento").value;

    /* CABEÇALHO */
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text("STARTPHONES", 105, 15, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(9);
    pdf.text("Rua Dep. Luiz, nº 69", 105, 20, { align: "center" });
    pdf.text("Telefone: 98985366343", 105, 24, { align: "center" });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("ORDEM DE SERVIÇO", 105, 32, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`OS Nº: ${numeroOS}`, 150, 38);
    pdf.text(`Data: ${data}`, 150, 44);

    pdf.line(10, 48, 200, 48);

    /* DADOS DO CLIENTE */
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(11);
    pdf.text("DADOS DO CLIENTE", 10, 56);
    pdf.rect(10, 59, 190, 24);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.text(`Nome: ${cliente}`, 12, 66);
    pdf.text(`Telefone: ${telefone}`, 12, 72);
    pdf.text(`CPF: ${cpf}`, 120, 72);

    /* DADOS DO EQUIPAMENTO */
    pdf.setFont("helvetica", "bold");
    pdf.text("DADOS DO EQUIPAMENTO", 10, 90);
    pdf.rect(10, 93, 190, 38);

    pdf.setFont("helvetica", "normal");
    pdf.text(`Equipamento: ${equipamento}`, 12, 100);
    pdf.text(`IMEI / Série: ${imei}`, 12, 106);
    pdf.text(`Senha: ${senha}`, 12, 112);
    pdf.text("Defeito / Observações:", 12, 118);
    pdf.text(observacoes || "-", 12, 124);

    /* VALOR */
    pdf.setFont("helvetica", "bold");
    pdf.text("VALOR DO SERVIÇO", 10, 142);
    pdf.rect(10, 145, 190, 16);

    pdf.setFont("helvetica", "normal");
    pdf.text(`Valor: R$ ${valor}`, 12, 154);
    pdf.text(`Forma de Pagamento: ${pagamento}`, 120, 154);

    /* TERMO */
    pdf.setFontSize(9);
    pdf.text(
`Declaro que estou ciente de que a STARTPHONES não se responsabiliza
por dados armazenados no aparelho, bem como por eventuais danos
decorrentes de defeitos ocultos. Autorizo a realização do serviço.`, 12, 170);

    /* ASSINATURAS */
    pdf.line(20, 200, 90, 200);
    pdf.line(120, 200, 190, 200);
    pdf.text("Assinatura do Cliente", 30, 205);
    pdf.text("Assinatura da Loja", 135, 205);

    pdf.save(`OS_${numeroOS}.pdf`);
}

/* ===============================
   GERAR ORDEM DE COMPRA (PDF)
   =============================== */
function gerarOC() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const numeroOC = proximaOC();

    const data = formatarDataOS(document.getElementById("ocData").value);
    const fornecedor = document.getElementById("ocFornecedor").value;
    const telefone = document.getElementById("ocTelefone").value;
    const cnpj = document.getElementById("ocCnpj").value;

    const produto = document.getElementById("ocEquipamento").value;
    const serie = document.getElementById("ocSerie").value;
    const modelo = document.getElementById("ocModelo").value;
    const ficha = document.getElementById("ocFicha").value;

    const valor = document.getElementById("ocValor").value;
    const pagamento = document.getElementById("ocPagamento").value;

    /* CABEÇALHO */
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(15);
    pdf.text("STARTPHONES", 105, 15, { align: "center" });

    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    pdf.text("Rua Dep. Luiz, nº 69", 105, 20, { align: "center" });
    pdf.text("Telefone: 98985366343", 105, 24, { align: "center" });

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text("NOTA DE COMPRA", 105, 32, { align: "center" });

    pdf.setFont("helvetica", "normal");
    pdf.text(`OC Nº: ${numeroOC}`, 150, 38);
    pdf.text(`Data: ${data}`, 150, 44);

    pdf.line(10, 48, 200, 48);

    /* FORNECEDOR */
    pdf.setFont("helvetica", "bold");
    pdf.text("DADOS DO CLIENTE", 10, 56);
    pdf.rect(10, 59, 190, 24);
    
    pdf.setFont("helvetica", "normal");
    pdf.text(`Nome: ${fornecedor}`, 12, 66);
    pdf.text(`Telefone: ${telefone}`, 12, 72);
    pdf.text(`CNPJ: ${cnpj}`, 120, 72);

    /* PRODUTO */
    pdf.setFont("helvetica", "bold");
    pdf.text("DADOS DO PRODUTO", 10, 90);
    pdf.rect(10, 93, 190, 36);
    
    pdf.setFont("helvetica", "normal");
    pdf.text(`Produto: ${produto}`, 12, 100);
    pdf.text(`Modelo: ${modelo}`, 12, 106);
    pdf.text(`Série: ${serie}`, 12, 112);
    pdf.text("Fichas Técnicas:", 12, 118);
    pdf.text(ficha || "-", 12, 124);

    /* VALOR */
    pdf.setFont("helvetica", "bold");
    pdf.text("VALOR DA COMPRA", 10, 142);
    pdf.rect(10, 145, 190, 16);
    
    pdf.setFont("helvetica", "normal");
    pdf.text(`Valor: R$ ${valor}`, 12, 154);
    pdf.text(`Forma de Pagamento: ${pagamento}`, 120, 154);

    pdf.save(`OC_${numeroOC}.pdf`);
}

