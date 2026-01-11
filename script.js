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
   PRÉVIA DO RELATÓRIO (TELA)
   =============================== */
function mostrarPrevia() {
    const tipo = document.getElementById("tipoRelatorio").value;
    let dados = [];
    
    if (tipo === "faturamento") {
    let totalEntradas = 0;
    let totalLucro = 0;
    let totalSaidas = 0;
    let totalPrejuizos = 0;
    let totalFixos = 0;

    entradas.forEach(e => {
        totalEntradas += e.valor;
        totalLucro += e.lucro || 0;
    });

    saidas.forEach(s => totalSaidas += s.valor);
    prejuizos.forEach(p => totalPrejuizos += p.valor);
    gastosFixos.forEach(g => totalFixos += g.valor);

    const lucroLiquido =
        totalLucro - (totalSaidas + totalPrejuizos + totalFixos);

    document.getElementById("previaRelatorio").innerHTML = `
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <tr><td><b>Total Entradas</b></td><td>R$ ${totalEntradas.toFixed(2)}</td></tr>
            <tr><td><b>Lucro Bruto</b></td><td>R$ ${totalLucro.toFixed(2)}</td></tr>
            <tr><td>Saídas</td><td>R$ ${totalSaidas.toFixed(2)}</td></tr>
            <tr><td>Prejuízos</td><td>R$ ${totalPrejuizos.toFixed(2)}</td></tr>
            <tr><td>Gastos Fixos</td><td>R$ ${totalFixos.toFixed(2)}</td></tr>
            <tr style="background:#eaf7ea;font-weight:bold;">
                <td>Lucro Líquido</td>
                <td>R$ ${lucroLiquido.toFixed(2)}</td>
            </tr>
        </table>
    `;
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
                ${tipo === "entradas"
                    ? '<th style="border:1px solid #ccc; padding:6px;">Lucro</th>'
                    : ""}
            </tr>
    `;

    dados.forEach(item => {
        totalValor += Number(item.valor);

        if (tipo === "entradas") {
            totalLucro += Number(item.lucro || 0);
        }

        html += `
            <tr>
                <td style="border:1px solid #ccc; padding:6px;">
                    ${item.tipo || item.descricao}
                </td>
                <td style="border:1px solid #ccc; padding:6px;">
                    ${formatarData(item.data)}
                </td>
                <td style="border:1px solid #ccc; padding:6px;">
                    R$ ${Number(item.valor).toFixed(2)}
                </td>
                ${tipo === "entradas"
                    ? `<td style="border:1px solid #ccc; padding:6px;">
                        R$ ${Number(item.lucro || 0).toFixed(2)}
                       </td>`
                    : ""}
            </tr>
        `;
    });

    html += `
        <tr style="background:#fafafa; font-weight:bold;">
            <td colspan="2" style="border:1px solid #ccc; padding:6px;">
                TOTAL
            </td>
            <td style="border:1px solid #ccc; padding:6px;">
                R$ ${totalValor.toFixed(2)}
            </td>
            ${tipo === "entradas"
                ? `<td style="border:1px solid #ccc; padding:6px;">
                    R$ ${totalLucro.toFixed(2)}
                   </td>`
                : ""}
        </tr>
    </table>
    `;

    document.getElementById("previaRelatorio").innerHTML = html;
}

/* ===============================
   GERAR PDF DO RELATÓRIO
   =============================== */
function gerarRelatorio() {
    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF();

    const tipo = document.getElementById("tipoRelatorio").value;
    let dados = [];
    
    if (tipo === "faturamento") {
    let totalEntradas = 0;
    let totalLucro = 0;
    let totalSaidas = 0;
    let totalPrejuizos = 0;
    let totalFixos = 0;

    entradas.forEach(e => {
        totalEntradas += e.valor;
        totalLucro += e.lucro || 0;
    });

    saidas.forEach(s => totalSaidas += s.valor);
    prejuizos.forEach(p => totalPrejuizos += p.valor);
    gastosFixos.forEach(g => totalFixos += g.valor);

    const lucroLiquido =
        totalLucro - (totalSaidas + totalPrejuizos + totalFixos);

    pdf.setFontSize(14);
    pdf.text("Relatório Financeiro Geral", 10, 15);

    pdf.setFontSize(11);
    let y = 30;

    pdf.text(`Total Entradas: R$ ${totalEntradas.toFixed(2)}`, 10, y); y+=8;
    pdf.text(`Lucro Bruto: R$ ${totalLucro.toFixed(2)}`, 10, y); y+=8;
    pdf.text(`Saídas: R$ ${totalSaidas.toFixed(2)}`, 10, y); y+=8;
    pdf.text(`Prejuízos: R$ ${totalPrejuizos.toFixed(2)}`, 10, y); y+=8;
    pdf.text(`Gastos Fixos: R$ ${totalFixos.toFixed(2)}`, 10, y); y+=10;

    pdf.setFontSize(13);
    pdf.text(`Lucro Líquido: R$ ${lucroLiquido.toFixed(2)}`, 10, y);

    pdf.save("faturamento_total.pdf");
    return;
}

    if (tipo === "entradas") dados = entradas;
    if (tipo === "prejuizos") dados = prejuizos;
    if (tipo === "saidas") dados = saidas;

    let totalValor = 0;
    let totalLucro = 0;

    pdf.setFontSize(14);
    pdf.text(`Relatório de ${tipo}`, 10, 12);

    pdf.setFontSize(10);
    let y = 24;

    // Cabeçalho
    pdf.text("Descrição", 10, y);
    pdf.text("Data", 110, y);
    pdf.text("Valor", 150, y);
    if (tipo === "entradas") pdf.text("Lucro", 180, y);

    y += 6;

    dados.forEach(item => {
        totalValor += Number(item.valor);
        if (tipo === "entradas") {
            totalLucro += Number(item.lucro || 0);
        }

        pdf.text(item.tipo || item.descricao, 10, y);
        pdf.text(formatarData(item.data), 110, y);
        pdf.text(`R$ ${Number(item.valor).toFixed(2)}`, 150, y);

        if (tipo === "entradas") {
            pdf.text(`R$ ${Number(item.lucro || 0).toFixed(2)}`, 180, y);
        }

        y += 6;

        if (y > 280) {
            pdf.addPage();
            y = 20;
        }
    });

    y += 8;
    pdf.setFont("helvetica", "bold");
    pdf.text(`TOTAL: R$ ${totalValor.toFixed(2)}`, 10, y);

    if (tipo === "entradas") {
        y += 6;
        pdf.text(`LUCRO TOTAL: R$ ${totalLucro.toFixed(2)}`, 10, y);
    }

    pdf.setFont("helvetica", "normal");

    pdf.save(`relatorio_${tipo}.pdf`);
}

/* ===============================
   UTIL - FORMATA DATA
   =============================== */
function formatarData(data) {
    if (!data) return "";
    const p = data.split("-");
    return `${p[2]}/${p[1]}/${p[0]}`;
}

function limparTudo() {
    if (!confirm("Tem certeza que deseja apagar TODOS os registros?")) return;

    localStorage.removeItem("entradas");
    localStorage.removeItem("saidas");
    localStorage.removeItem("prejuizos");
    localStorage.removeItem("gastosFixos");

    entradas = [];
    saidas = [];
    prejuizos = [];
    gastosFixos = [];

    document.getElementById("previaRelatorio").innerHTML = "";

    alert("Todos os registros foram apagados");
}


function addGastoFixo() {
    gastosFixos.push({
        tipo: tipoGastoFixo.value,
        valor: Number(valorGastoFixo.value),
        data: new Date().toISOString().split("T")[0]
    });

    localStorage.setItem("gastosFixos", JSON.stringify(gastosFixos));
    alert("Gasto fixo adicionado");
}
