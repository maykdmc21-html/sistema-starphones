/* ===============================
    DADOS (LOCALSTORAGE)
   =============================== */
let gastosFixos = JSON.parse(localStorage.getItem("gastosFixos")) || [];
let entradas = JSON.parse(localStorage.getItem("entradas")) || [];
let prejuizos = JSON.parse(localStorage.getItem("prejuizos")) || [];
let saidas = JSON.parse(localStorage.getItem("saidas")) || [];

/* ===============================
    ENTRADAS
   =============================== */
function addEntrada() {
    entradas.push({
        tipo: tipoEntrada.value,
        valor: Number(valorEntrada.value),
        lucro: Number(lucroEntrada.value),
        data: dataEntrada.value
    });
    localStorage.setItem("entradas", JSON.stringify(entradas));
    alert("Entrada adicionada");
}

/* ===============================   
    PREJUÍZOS
   =============================== */
function addPrejuizo() {
    prejuizos.push({
        descricao: descPrejuizo.value,
        valor: Number(valorPrejuizo.value),
        data: new Date().toISOString().split("T")[0]
    });
    localStorage.setItem("prejuizos", JSON.stringify(prejuizos));
    alert("Prejuízo adicionado");
}

/* ===============================
    SAÍDAS
   =============================== */
function addSaida() {
    saidas.push({
        descricao: descSaida.value,
        valor: Number(valorSaida.value),
        data: new Date().toISOString().split("T")[0]
    });
    localStorage.setItem("saidas", JSON.stringify(saidas));
    alert("Saída adicionada");
}

/* ===============================
    GASTOS FIXOS
   =============================== */
function addGastoFixo() {
    gastosFixos.push({
        tipo: tipoGastoFixo.value,
        valor: Number(valorGastoFixo.value),
        data: new Date().toISOString().split("T")[0]
    });
    localStorage.setItem("gastosFixos", JSON.stringify(gastosFixos));
    alert("Gasto fixo adicionado");
}

/* ===============================
    PRÉVIA DO RELATÓRIO (APENAS TELA)
   =============================== */
function mostrarPrevia() {
    const tipo = document.getElementById("tipoRelatorio").value;
    let dados = [];

    if (tipo === "faturamento") {
        let tEntradas = 0, tLucro = 0, tSaidas = 0, tPrejuizos = 0, tFixos = 0;
        entradas.forEach(e => { tEntradas += e.valor; tLucro += (e.lucro || 0); });
        saidas.forEach(s => tSaidas += s.valor);
        prejuizos.forEach(p => tPrejuizos += p.valor);
        gastosFixos.forEach(g => tFixos += g.valor);
        const lucroLiquido = tLucro - (tSaidas + tPrejuizos + tFixos);

        document.getElementById("previaRelatorio").innerHTML = `
            <table style="width:100%; border-collapse:collapse; font-size:14px;">
                <tr><td><b>Total Entradas</b></td><td>R$ ${tEntradas.toFixed(2)}</td></tr>
                <tr><td><b>Lucro Bruto</b></td><td>R$ ${tLucro.toFixed(2)}</td></tr>
                <tr><td>Saídas</td><td>R$ ${tSaidas.toFixed(2)}</td></tr>
                <tr><td>Prejuízos</td><td>R$ ${tPrejuizos.toFixed(2)}</td></tr>
                <tr><td>Gastos Fixos</td><td>R$ ${tFixos.toFixed(2)}</td></tr>
                <tr style="background:#eaf7ea;font-weight:bold;">
                    <td>Lucro Líquido</td><td>R$ ${lucroLiquido.toFixed(2)}</td>
                </tr>
            </table>`;
        return;
    }

    if (tipo === "entradas") dados = entradas;
    if (tipo === "prejuizos") dados = prejuizos;
    if (tipo === "saidas") dados = saidas;

    let totalValor = 0;
    let totalLucro = 0;

    let html = `
        <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <tr style="background:#f0f0f0; font-weight:bold;">
                <th style="border:1px solid #ccc; padding:6px;">Descrição</th>
                <th style="border:1px solid #ccc; padding:6px;">Data</th>
                <th style="border:1px solid #ccc; padding:6px;">Valor</th>
                <th style="border:1px solid #ccc; padding:6px; width:50px;">Ação</th>
                ${tipo === "entradas" ? `<th style="border:1px solid #ccc; padding:6px;">Lucro</th>` : ""}
            </tr>`;

    dados.forEach((item, index) => {
        totalValor += Number(item.valor);
        if (tipo === "entradas") totalLucro += Number(item.lucro || 0);
        html += `
            <tr>
                <td style="border:1px solid #ccc; padding:6px;">${item.tipo || item.descricao}</td>
                <td style="border:1px solid #ccc; padding:6px;">${formatarData(item.data)}</td>
                <td style="border:1px solid #ccc; padding:6px;">R$ ${Number(item.valor).toFixed(2)}</td>
                <td style="border:1px solid #ccc; padding:6px; text-align:center;">
                    <button onclick="deletarRegistro(${index}, '${tipo}')" style="background:none;border:none;color:#c0392b;cursor:pointer;font-size:16px;">🗑️</button>
                </td>
                ${tipo === "entradas" ? `<td style="border:1px solid #ccc; padding:6px;">R$ ${Number(item.lucro || 0).toFixed(2)}</td>` : ""}
            </tr>`;
    });

    html += `
        <tr style="background:#fafafa; font-weight:bold;">
            <td colspan="2" style="border:1px solid #ccc; padding:6px; text-align:right;">TOTAL:</td>
            <td style="border:1px solid #ccc; padding:6px;">R$ ${totalValor.toFixed(2)}</td>
            <td style="border:1px solid #ccc; padding:6px;"></td>
            ${tipo === "entradas" ? `<td style="border:1px solid #ccc; padding:6px;">R$ ${totalLucro.toFixed(2)}</td>` : ""}
        </tr>
    </table>`;
    document.getElementById("previaRelatorio").innerHTML = html;
}

/* ===============================
    GERAR RELATÓRIO (PDF PROFISSIONAL)
   =============================== */
function gerarRelatorio() {
    const tipo = document.getElementById("tipoRelatorio").value;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Cabeçalho StartPhones
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text("STARTPHONES", 10, 15);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text("CNPJ: 26.532.558/0001-01", 10, 20);
    doc.text("Endereço: Rua Dep. Luiz, nº 69", 10, 24);
    doc.text("Telefone: (98) 98536-6343", 10, 28);
    
    const dataE = new Date().toLocaleDateString();
    doc.text(`Emissão: ${dataE}`, 160, 20);
    doc.text(`Horas: ${new Date().toLocaleTimeString()}`, 160, 24);
    doc.line(10, 32, 200, 32);

    if (tipo === "faturamento") {
        doc.setFontSize(12); doc.setFont("helvetica", "bold");
        doc.text("DEMONSTRATIVO DE BASES E FATURAMENTO", 10, 40);

        let tEnt = 0, tLuc = 0, tSai = 0, tPrej = 0, tFix = 0;
        entradas.forEach(e => { tEnt += e.valor; tLuc += (e.lucro || 0); });
        saidas.forEach(s => tSai += s.valor);
        prejuizos.forEach(p => tPrej += p.valor);
        gastosFixos.forEach(g => tFix += g.valor);
        const liq = tLuc - (tSai + tPrej + tFix);

        let y = 55;
        const addL = (desc, v, dest = false) => {
            if (dest) { doc.setFont("helvetica", "bold"); doc.setFillColor(245, 245, 245); doc.rect(10, y-5, 190, 8, 'F'); }
            else doc.setFont("helvetica", "normal");
            doc.text(desc, 12, y);
            doc.text(`R$ ${v.toFixed(2)}`, 195, y, { align: "right" });
            doc.line(10, y + 2, 200, y + 2);
            y += 10;
        };
        addL("Faturamento Bruto", tEnt);
        addL("Margem de Lucro Bruto", tLuc);
        addL("Deduções de Saídas", tSai);
        addL("Deduções de Prejuízos", tPrej);
        addL("Gastos Fixos", tFix);
        y += 5;
        addL("LUCRO LÍQUIDO FINAL", liq, true);
    } else {
        doc.setFontSize(12); doc.setFont("helvetica", "bold");
        doc.text(`RELATÓRIO DE ${tipo.toUpperCase()}`, 10, 40);
    }

    doc.save(`Relatorio_StartPhone_${dataE.replace(/\//g, '-')}.pdf`);
}

/* ===============================
    GERAR ORDEM DE SERVIÇO (PDF)
   =============================== */
function gerarOS() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const dataOS = document.getElementById("osData").value;
    const cliente = document.getElementById("osCliente").value;
    const equipamento = document.getElementById("osEquipamento").value;
    const valor = document.getElementById("osValor").value;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("ORDEM DE SERVIÇO - STARTPHONES", 10, 15);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Cliente: ${cliente}`, 10, 30);
    doc.text(`Telefone: ${document.getElementById("osTelefone").value}`, 10, 35);
    doc.text(`Equipamento: ${equipamento}`, 10, 45);
    doc.text(`IMEI/Série: ${document.getElementById("osImei").value}`, 10, 50);
    doc.text(`Defeito: ${document.getElementById("osObs").value}`, 10, 60);
    doc.text(`Valor: R$ ${valor}`, 10, 75);
    doc.text(`Data: ${formatarData(dataOS)}`, 10, 80);

    doc.save(`OS_${cliente}.pdf`);
}

/* ===============================
    GERAR ORDEM DE COMPRA (PDF)
   =============================== */
function gerarOC() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const dataOC = document.getElementById("ocData").value;
    const fornecedor = document.getElementById("ocFornecedor").value;
    const produto = document.getElementById("ocEquipamento").value;
    const valor = document.getElementById("ocValor").value;

    doc.setFont("helvetica", "bold");
    doc.text("ORDEM DE COMPRA - STARTPHONES", 10, 15);
    doc.setFont("helvetica", "normal");
    doc.text(`Fornecedor: ${fornecedor}`, 10, 30);
    doc.text(`Produto: ${produto}`, 10, 40);
    doc.text(`Valor: R$ ${valor}`, 10, 50);
    doc.text(`Data: ${formatarData(dataOC)}`, 10, 60);

    doc.save(`OC_${fornecedor}.pdf`);
}

/* ===============================
    DELETAR E LIMPAR
   =============================== */
function deletarRegistro(index, tipo) {
    if (!confirm("Deseja realmente apagar este registro?")) return;
    if (tipo === "entradas") { entradas.splice(index, 1); localStorage.setItem("entradas", JSON.stringify(entradas)); }
    if (tipo === "prejuizos") { prejuizos.splice(index, 1); localStorage.setItem("prejuizos", JSON.stringify(prejuizos)); }
    if (tipo === "saidas") { saidas.splice(index, 1); localStorage.setItem("saidas", JSON.stringify(saidas)); }
    mostrarPrevia();
}

function limparTudo() {
    if (!confirm("Tem certeza?")) return;
    localStorage.clear();
    entradas = []; saidas = []; prejuizos = []; gastosFixos = [];
    document.getElementById("previaRelatorio").innerHTML = "";
    alert("Limpo com sucesso");
}

function formatarData(data) {
    if (!data) return "";
    const p = data.split("-");
    return `${p[2]}/${p[1]}/${p[0]}`;
}
