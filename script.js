// ===================== ELEMENTOS =====================
const crimeContainer = document.getElementById("crimeContainer");
const searchCrime = document.getElementById("searchCrime");
const calcularBtn = document.getElementById("calcularBtn");
const gerarRelatorio = document.getElementById("gerarRelatorio");

const checklistModal = document.getElementById("checklistModal");
const confirmarChecklist = document.getElementById("confirmarChecklist");
const cancelarChecklist = document.getElementById("cancelarChecklist");

const guarnicao = document.getElementById("guarnicao");
const boAuto = document.getElementById("boAuto");

// ===================== RESULTADO GLOBAL =====================
let resultadoFinal = {
  pena: 0,
  multa: 0,
  fianca: ""
};

// ===================== DESCRIÇÃO ATENUANTES / AGRAVANTES =====================
const efeitosMapa = {
  // ATENUANTES
  advogado: "Redução a pena em 30%",
  reup: "Redução a pena em 10%",
  confesso: "Redução de pena em 10%",
  delacao: "Redução de pena de 50% (exige delegado)",
  delegado: "Habilita delação premiada",
  colaboracao: "Redução de pena em 10%",
  porte_legal: "Redução de pena em 10%",

  // AGRAVANTES
  reincidente: "Aumenta a pena em 10%",
  resistencia: "Aumenta a pena em 10%",
  fuga: "Aumenta a pena em 10%",
  desacato: "Aumenta a pena em 10%",
  };


// ===================== BO AUTOMÁTICO =====================
const boCounters = {
  PRF: 1, PMERJ: 1, CHOQUE: 1, BOPE: 1, PCERJ: 1, CORE: 1, EXERCITO: 1
};
const boPrefixo = {
  PRF: "PRF", PMERJ: "PM", CHOQUE: "CHQ", BOPE: "BOPE", PCERJ: "PC", CORE: "CORE", EXERCITO: "EB"
};

function atualizarBO() {
  const g = guarnicao.value;
  boAuto.value = `${boPrefixo[g]}-${boCounters[g].toString().padStart(3,"0")}`;
  boCounters[g]++;
}
guarnicao.addEventListener("change", atualizarBO);
atualizarBO();

// ===================== BASE COMPLETA DE CRIMES =====================
const crimeCategorias = [
{
  titulo: "Crimes contra a Vida",
  gravidade: "altissima",
  icone: "☠️",
  crimes: [
    { artigo:"Art. 121 §2º", nome:"Homicídio Doloso Qualificado", meses:180, multa:5000, fianca:false },
    { artigo:"Art. 121", nome:"Homicídio Doloso", meses:120, multa:4000, fianca:false },
    { artigo:"Art. 121 c/c Art. 14", nome:"Tentativa de Homicídio", meses:100, multa:3000, fianca:true },
    { artigo:"Art. 121 §3º", nome:"Homicídio Culposo", meses:60, multa:2000, fianca:true },
    { artigo:"Art. 302 CTB", nome:"Homicídio Culposo no Trânsito", meses:48, multa:1500, fianca:true }
  ]
},
{
  titulo: "Crimes Violentos",
  gravidade: "alta",
  icone: "🔥",
  crimes: [
    { artigo:"Art. 129", nome:"Lesão Corporal", meses:24, multa:1000, fianca:true },
    { artigo:"Art. 250", nome:"Incêndio", meses:36, multa:2000, fianca:true },
    { artigo:"Art. 159", nome:"Sequestro", meses:120, multa:5000, fianca:false },
    { artigo:"Art. 148", nome:"Cárcere Privado", meses:80, multa:3000, fianca:true }
  ]
},
{
  titulo: "Crimes contra o Patrimônio Veicular",
  gravidade: "media",
  icone: "🚗",
  crimes: [
    { artigo:"Art. 311", nome:"Desmanche de Veículos", meses:60, multa:2500, fianca:true },
    { artigo:"Art. 155 §4º", nome:"Furto de Veículos", meses:48, multa:2000, fianca:true },
    { artigo:"Art. 180", nome:"Receptação de Veículos", meses:36, multa:1800, fianca:true },
    { artigo:"Art. 157", nome:"Roubo/Assalto à Veículos", meses:72, multa:3500, fianca:true }
  ]
},
{
  titulo: "Crimes contra o Patrimônio",
  gravidade: "media",
  icone: "💰",
  crimes: [
    { artigo:"Art. 157", nome:"Roubo/Assalto", meses:48, multa:2500, fianca:true },
    { artigo:"Art. 155", nome:"Furto", meses:24, multa:1200, fianca:true },
    { artigo:"Art. 155 §4º", nome:"Furto a Caixa Eletrônico", meses:30, multa:2000, fianca:true },
    { artigo:"Art. 158", nome:"Extorsão", meses:72, multa:3500, fianca:true },
    { artigo:"Art. 171", nome:"Estelionato", meses:30, multa:1500, fianca:true },
    { artigo:"Art. 163", nome:"Dano ao Patrimônio Público", meses:24, multa:2000, fianca:true },
    { artigo:"Art. 150", nome:"Invasão de Imóvel", meses:36, multa:1800, fianca:true }
  ]
},
{
  titulo: "Porte, Posse e Tráfico de Armas",
  gravidade: "media",
  icone: "🔫",
  crimes: [
    { artigo:"Lei 10.826 Art.12", nome:"Posse de Peças de Armas", meses:12, multa:1000, fianca:true },
    { artigo:"Lei 10.826 Art.13", nome:"Posse de Artefatos para Produção de Munição", meses:18, multa:1200, fianca:true },
    { artigo:"Lei 10.826 Art.12", nome:"Posse de Arma Ilegal", meses:24, multa:2000, fianca:true },
    { artigo:"Lei 10.826 Art.14", nome:"Porte de Arma Ilegal", meses:36, multa:3000, fianca:true },
    { artigo:"Lei 10.826 Art.15", nome:"Disparo de Arma de Fogo", meses:24, multa:2000, fianca:true },
    { artigo:"Lei 10.826 Art.12", nome:"Posse de Munição (menos de 101)", meses:12, multa:800, fianca:true },
    { artigo:"Lei 10.826 Art.18", nome:"Tráfico de Armas (mais de 3)", meses:60, multa:5000, fianca:false }
  ]
},
{
  titulo: "Drogas / Narcotráfico",
  gravidade: "alta",
  icone: "💊",
  crimes: [
    { artigo:"Lei 11.343 Art.28", nome:"Posse de Drogas (menos de 101)", meses:12, multa:1000, fianca:true },
    { artigo:"Lei 11.343 Art.33", nome:"Tráfico de Drogas (mais de 100)", meses:72, multa:4000, fianca:false },
    { artigo:"Lei 11.343 Art.33 §4º", nome:"Entrega de Drogas (aviãozinho)", meses:48, multa:2500, fianca:true },
    { artigo:"Lei 11.343 Art.34", nome:"Posse de Componentes Narcóticos", meses:36, multa:2000, fianca:true },
    { artigo:"Lei 11.343 Art.35", nome:"Associação ao Tráfico", meses:60, multa:3500, fianca:false },
    { artigo:"Lei 11.343 Art.36", nome:"Dinheiro Sujo", meses:24, multa:1800, fianca:true }
  ]
},
{
  titulo: "Ordem Pública",
  gravidade: "baixa",
  icone: "⚠️",
  crimes: [
    { artigo:"Art. 286", nome:"Apologia ao Crime", meses:12, multa:800, fianca:true },
    { artigo:"Art. 333", nome:"Suborno", meses:24, multa:2000, fianca:true },
    { artigo:"Art. 147", nome:"Ameaça", meses:18, multa:1200, fianca:true },
    { artigo:"Art. 340", nome:"Falsa Comunicação de Crime", meses:12, multa:800, fianca:true },
    { artigo:"Art. 265", nome:"Uso Indevido do 190/192", meses:12, multa:600, fianca:true },
    { artigo:"Art. 330", nome:"Desobediência", meses:12, multa:700, fianca:true },
    { artigo:"Art. 233", nome:"Atentado ao Pudor", meses:18, multa:1500, fianca:true },
    { artigo:"Art. 150", nome:"Invasão de Propriedade", meses:24, multa:1400, fianca:true },
    { artigo:"Art. 19 LCP", nome:"Uso de Máscara", meses:12, multa:500, fianca:true },
    { artigo:"Lei 10.826", nome:"Uso de Equipamentos Restritos", meses:12, multa:1000, fianca:true },
    { artigo:"Art. 19 LCP", nome:"Armas Brancas", meses:12, multa:700, fianca:true },
    { artigo:"Art. 299", nome:"Falsidade Ideológica", meses:12, multa:900, fianca:true },
	{ artigo:"Art. 328", nome:"Exercício Ilegal da Profissão", meses:15, multa:3000, fianca:true },
    { artigo:"Art. 135", nome:"Omissão de Socorro", meses:12, multa:800, fianca:true }
  ]
},
{
  titulo: "Crimes contra Autoridade (Sem Fiança)",
  gravidade: "alta",
  icone: "🛑",
  crimes: [
    { artigo:"Art. 331", nome:"Desacato", meses:36, multa:2000, fianca:false },
    { artigo:"Art. 329", nome:"Resistência à Prisão", meses:24, multa:1500, fianca:false },
    { artigo:"Art. 316", nome:"Abuso de Autoridade", meses:36, multa:2000, fianca:false },
    { artigo:"Art. 319", nome:"Prevaricação", meses:24, multa:1800, fianca:false },
    { artigo:"Art. 344", nome:"Obstrução da Justiça", meses:36, multa:2500, fianca:false },
	{ artigo:"Art. 317/333", nome:"Corrupção Ativa/Passiva", meses:48, multa:3000, fianca:false }
  ]
},
{
  titulo: "Crimes de Trânsito",
  gravidade: "leve",
  icone: "🚦️",
  crimes: [
    { artigo:"Art. 311 CTB", nome:"Tentativa de Fuga", meses:12, multa:800, fianca:true },
    { artigo:"Art. 306 CTB", nome:"Condução Imprudente", meses:12, multa:700, fianca:true },
    { artigo:"Art. 193 CTB", nome:"Dirigir na Contramão", meses:12, multa:700, fianca:true },
    { artigo:"Art. 308 CTB", nome:"Alta Velocidade", meses:12, multa:1000, fianca:true },
    { artigo:"Art. 228 CTB", nome:"Poluição Sonora", meses:6, multa:500, fianca:true },
    { artigo:"Art. 230 CTB", nome:"Uso Excessivo de Insulfilm", meses:6, multa:500, fianca:true },
    { artigo:"Art. 230 CTB", nome:"Veículo Muito Danificado", meses:12, multa:800, fianca:true },
    { artigo:"Art. 230 CTB", nome:"Veículo Irregular", meses:12, multa:800, fianca:true },
    { artigo:"Art. 181 CTB", nome:"Veículo Ilegalmente Estacionado", meses:6, multa:400, fianca:true },
    { artigo:"Art. 302 CTB", nome:"Tentativa de Homicídio no Trânsito", meses:72, multa:3500, fianca:false }
  ]
}
];

// ===================== RENDERIZAÇÃO DOS CRIMES =====================
crimeCategorias.forEach(cat => {
  const bloco = document.createElement("div");
  bloco.className = "crime-bloco";
  const colCount = getComputedStyle(crimeContainer)
  .gridTemplateColumns.split(" ").length || 3;

const index = crimeContainer.children.length;
bloco.dataset.coluna = index % colCount;
  const header = document.createElement("div");
  header.className = "crime-header";
  header.innerHTML = `
  <span class="crime-icon">${cat.icone}</span>
  <span>${cat.titulo}</span>
`;
header.dataset.gravidade = cat.gravidade;

  const lista = document.createElement("div");
  lista.className = "crime-lista hidden";

  cat.crimes.forEach(c => {
    const item = document.createElement("div");
    item.className = "crime-item";
    item.innerHTML = `
  <strong>${c.artigo}</strong><br>
  <span class="crime-nome">${c.nome}</span>
`;

    item.dataset.meses = c.meses;
    item.dataset.multa = c.multa;
    item.dataset.fianca = c.fianca;
	item.dataset.nome = c.nome;
	item.dataset.artigo = c.artigo;

document.querySelectorAll(".crime-item.selected").forEach(i=>{
  const nomeCrime = i.dataset.nome;
  const artigo = i.dataset.artigo;
  crimesTexto += `• ${artigo} – ${nomeCrime}<br>`;
});

    item.onclick = () => {
      item.classList.toggle("selected");
    };

    lista.appendChild(item);
  });

/*header.onclick = () => {

  const blocoAtual = header.closest(".crime-bloco");
  const container = document.getElementById("crimeContainer");
  const blocos = Array.from(container.children);

  const colunas = getComputedStyle(container)
    .gridTemplateColumns.split(" ").length;

  const indexAtual = blocos.indexOf(blocoAtual);
  const colunaAtual = (indexAtual % colunas) + 1;

  const jaAtivo = blocoAtual.classList.contains("ativo");

  // 🔴 SE JÁ ESTIVER ATIVO → FECHA TUDO
  if (jaAtivo) {
    blocos.forEach(b => {
      b.classList.remove("ativo", "coluna-hidden");
      b.style.gridColumn = "";
      b.style.gridRow = "";
      b.querySelector(".crime-header").classList.remove("open");
      b.querySelector(".crime-lista")?.classList.add("hidden");
    });
    return;
  }

  // 🔄 FECHA TUDO ANTES DE ABRIR OUTRO
  blocos.forEach(b => {
    b.classList.remove("ativo", "coluna-hidden");
    b.style.gridColumn = "";
    b.style.gridRow = "";
    b.querySelector(".crime-header").classList.remove("open");
    b.querySelector(".crime-lista")?.classList.add("hidden");
  });

  // ✅ ATIVA O NOVO
  blocoAtual.classList.add("ativo");
  blocoAtual.style.gridColumn = colunaAtual;
  blocoAtual.style.gridRow = 1;

  header.classList.add("open");
  lista.classList.remove("hidden");

  // 👻 ESCONDE APENAS OS DA MESMA COLUNA
  blocos.forEach((b, i) => {
    const colunaDoBloco = (i % colunas) + 1;
    if (b !== blocoAtual && colunaDoBloco === colunaAtual) {
      b.classList.add("coluna-hidden");
    }
  });
};*/

  bloco.appendChild(header);
  bloco.appendChild(lista);
  crimeContainer.appendChild(bloco);
});

// ===================== NORMALIZAR TEXTO (REMOVE ACENTOS) =====================
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// ===================== PESQUISA DE CRIMES (CORRIGIDA) =====================
searchCrime.addEventListener("input", (e) => {
  const termo = normalizarTexto(e.target.value.trim());

  document.querySelectorAll("#crimeContainer .crime-bloco").forEach(bloco => {
    const header = bloco.querySelector(".crime-header");
    const lista = bloco.querySelector(".crime-lista");
    const itens = bloco.querySelectorAll(".crime-item");

    let encontrou = false;

    itens.forEach(item => {
      const texto = normalizarTexto(item.textContent);

      if (texto.includes(termo)) {
        item.style.display = "block";
        encontrou = true;
      } else {
        item.style.display = "none";
      }
    });

    if (termo === "") {
      // reset visual
      header.classList.remove("open");
      lista.classList.add("hidden");
      itens.forEach(i => i.style.display = "block");
    } else if (encontrou) {
      // abre categoria com resultado
      header.classList.add("open");
      lista.classList.remove("hidden");
    } else {
      // fecha categoria sem resultado
      header.classList.remove("open");
      lista.classList.add("hidden");
    }
  });
});


// ===================== ATENUANTES =====================
const atenuantesBtns = [...document.querySelectorAll("#atenuantesBtns .crime-item")];

function getAtenuantes(){
  return atenuantesBtns
    .filter(b=>b.classList.contains("selected"))
    .map(b=>b.dataset.value);
}

atenuantesBtns.forEach(btn=>{
  btn.onclick = ()=>{
    const v = btn.dataset.value;
    const ativos = getAtenuantes();

    if(v === "delacao" && !ativos.includes("delegado"))
      return alert("⚠️ Delação só pode ser aplicada com Delegado Presente.");

    if((v === "reup" || v === "confesso") && !ativos.includes("advogado"))
      return alert("⚠️ Necessário advogado constituído.");

    btn.classList.toggle("selected");
  };
});

// ===================== CONTROLE ADVOGADO / DELEGADO =====================

const advogadoNome = document.getElementById("advogadoNome");
const advogadoPassaporte = document.getElementById("advogadoPassaporte");

const respNome = document.getElementById("respNome");
const respPassaporte = document.getElementById("respPassaporte");

function limparAdvogado() {
  advogadoNome.value = "";
  advogadoPassaporte.value = "";
  advogadoNome.disabled = true;
  advogadoPassaporte.disabled = true;
}

function limparDelegado() {
  respNome.value = "";
  respPassaporte.value = "";
  respNome.disabled = true;
  respPassaporte.disabled = true;
}

function atualizarCamposLegais() {
  const atenuantesSelecionados = getAtenuantes();

  // ADVOGADO
  if (atenuantesSelecionados.includes("advogado")) {
    advogadoNome.disabled = false;
    advogadoPassaporte.disabled = false;
  } else {
    limparAdvogado();
  }

  // DELEGADO
  if (atenuantesSelecionados.includes("delegado")) {
    respNome.disabled = false;
    respPassaporte.disabled = false;
  } else {
    limparDelegado();
  }
}

// Sempre que clicar em um atenuante
document.querySelectorAll("#atenuantesBtns .crime-item")
  .forEach(btn => {
    btn.addEventListener("click", atualizarCamposLegais);
  });

// Garante estado inicial
atualizarCamposLegais();


// ===================== AGRAVANTES =====================
const agravantesBtns = [...document.querySelectorAll("#agravantesBtns .crime-item")];
agravantesBtns.forEach(btn=>{
  btn.onclick = ()=>btn.classList.toggle("selected");
});

// ===================== CÁLCULO =====================
function calcularPenalidades(){

  let penaBruta = 0;
  let multaBruta = 0;
  let fiancaTotal = 0;
  let fiancaPermitida = true;

  document.querySelectorAll(".crime-item.selected").forEach(i=>{
    crimeCategorias.forEach(cat=>{
      const nomeCrime = i.querySelector(".crime-nome")?.textContent;
	  const c = cat.crimes.find(x => x.nome === nomeCrime);
      if(c){
        penaBruta += c.meses;
        multaBruta += c.multa;
        if(c.fianca) fiancaTotal += Math.floor(c.multa/2);
        else fiancaPermitida = false;
      }
    });
  });

  const atenuantes = getAtenuantes();
  const agravantesQtd = document.querySelectorAll("#agravantesBtns .crime-item.selected").length;

  let penaFinal = penaBruta;

  if(atenuantes.includes("advogado")) penaFinal *= 0.7;
  if(atenuantes.includes("reup")) penaFinal *= 0.9;
  if(atenuantes.includes("confesso")) penaFinal *= 0.9;

  penaFinal += penaFinal * (agravantesQtd * 0.1);
  penaFinal = Math.max(1, Math.floor(penaFinal));

  resultadoFinal.pena = penaFinal;
  resultadoFinal.multa = multaBruta;
  resultadoFinal.fianca = fiancaPermitida ? `R$ ${fiancaTotal}` : "❌ Não permitida";
}

// ===================== BOTÃO CALCULAR =====================
calcularBtn.onclick = () => {
  calcularPenalidades();
  gerarBoletimConferencia();
  boletimModal.classList.remove("hidden");
  alert("✅ Penalidades calculadas.");
};

// ===================== CHECKLIST =====================
const checklistItens = [...document.querySelectorAll(".check-item")];
confirmarChecklist.disabled = true;

// Função para verificar se todos os itens estão marcados
function atualizarBotaoChecklist() {
  const todosMarcados = checklistItens.every(i => i.classList.contains("done"));
  confirmarChecklist.disabled = !todosMarcados;
}

// Inicializa clique nos itens
checklistItens.forEach(i => {
  i.addEventListener("click", () => {
    i.classList.toggle("done");
    atualizarBotaoChecklist();
  });
});

// Confirma checklist e copia para o Discord
confirmarChecklist.onclick = () => {
  // Garantir que todos os itens estejam marcados
  if (checklistItens.some(i => !i.classList.contains("done"))) {
    alert("⚠️ Marque todos os itens do checklist antes de confirmar!");
    return;
  }

  calcularPenalidades();
  const atenuantes = getAtenuantes();

  let texto = `\`\`\`diff
🧾 RELATÓRIO DE PRISÃO
────────────────────────
`;

  // Crimes selecionados
  let crimes = [];
  document.querySelectorAll(".crime-item.selected").forEach(i => crimes.push(i.textContent));
  texto += `+ CRIMES: ${crimes.join(", ")}\n`;

  // Penalidades
  texto += `= PENA: ${resultadoFinal.pena} meses | MULTA: R$ ${resultadoFinal.multa} | FIANÇA: ${resultadoFinal.fianca}\n`;

  // Advogado
  if (atenuantes.includes("advogado")) {
    texto += `👨‍⚖️ ADV: ${advogadoNome.value} | Passaporte: ${advogadoPassaporte.value}\n`;
  }

  // Delegado
  if (atenuantes.includes("delegado")) {
    texto += `👮 RESP: ${respNome.value} | Passaporte: ${respPassaporte.value}\n`;
  }

  // Checklist
  texto += `────────────────────────\n📋 CHECKLIST:\n`;
  checklistItens.forEach(i => {
    const done = i.classList.contains("done") ? "✅" : "⭕";
    texto += `${done} ${i.textContent.trim()}\n`;
  });

  texto += `────────────────────────
📌 Relatório gerado automaticamente
\`\`\``;

  navigator.clipboard.writeText(gerarFichaCriminalDiscord())
  .then(() => alert("📋 Relatório formatado para Discord copiado!"));


  checklistModal.classList.add("hidden");
};

// ==================== RELATORIO PARA TABLET ===================== //
function gerarListaCompactaCrimes() {
  let lista = [];

  document.querySelectorAll(".crime-item.selected").forEach(i => {
    const artigo = i.dataset.artigo;
    const nome = i.dataset.nome;
    lista.push(`${artigo} – ${nome}`);
  });

  return lista.join(", ");
}

// ==================== BOTAO PARA TABLET ===================== //

const sistemaTablet = document.getElementById("sistemaTablet");

if (sistemaTablet) {
  sistemaTablet.onclick = () => {

    // Garante que os cálculos estejam atualizados
    calcularPenalidades();

    const listaCompacta = gerarListaCompactaCrimes();

    if (!listaCompacta) {
      alert("⚠️ Nenhum crime selecionado.");
      return;
    }

    // Copia diretamente para o clipboard
    navigator.clipboard.writeText(listaCompacta)
      .then(() => {
        alert("📋 Lista compacta copiada para o sistema do tablet!");
      });
  };
}


// ===================== RELATÓRIO =====================
gerarRelatorio.onclick = ()=>{
  calcularPenalidades();
  checklistModal.classList.remove("hidden");
};

cancelarChecklist.onclick = ()=>{
  checklistModal.classList.add("hidden");
};

confirmarChecklist.onclick = () => {

  calcularPenalidades();

  const atenuantes = getAtenuantes();

  if (atenuantes.includes("advogado")) {
    if (!advogadoNome.value.trim() || !advogadoPassaporte.value.trim()) {
      alert("⚠️ Preencha os dados do advogado.");
      return;
    }
  }

  if (atenuantes.includes("delegado")) {
    if (!respNome.value.trim() || !respPassaporte.value.trim()) {
      alert("⚠️ Preencha os dados do delegado.");
      return;
    }
  }

  // ✅ AQUI GERA O RELATÓRIO BONITO DO DISCORD
  navigator.clipboard.writeText(gerarFichaCriminalDiscord())
    .then(() => alert("📋 Relatório formatado para Discord copiado!"));

  checklistModal.classList.add("hidden");
};




const boletimModal = document.getElementById("boletimModal");
const boletimConteudo = document.getElementById("boletimConteudo");
const fecharBoletim = document.getElementById("fecharBoletim");

function gerarBoletimConferencia(){

  let crimesTexto = "";
  let penaBruta = 0;
  let multaBruta = 0;
  let fiancaBruta = 0;
  let fiancaPermitida = true;

  document.querySelectorAll(".crime-item.selected").forEach(i=>{
    crimeCategorias.forEach(cat=>{
		const nomeCrime = i.querySelector(".crime-nome")?.textContent;
		const c = cat.crimes.find(x => x.nome === nomeCrime);
        if(c){
        crimesTexto += `• ${c.artigo} – ${c.nome}<br>`;
        penaBruta += c.meses;
        multaBruta += c.multa;
        if(c.fianca) fiancaBruta += Math.floor(c.multa/2);
        else fiancaPermitida = false;
      }
    });
  });

  const penaFinal = resultadoFinal.pena;
  const multaFinal = resultadoFinal.multa;
  const fiancaFinal = resultadoFinal.fianca;

  boletimConteudo.innerHTML = `
<div class="boletim-bloco">
  <h4>🚨 CRIMES IMPUTADOS</h4>
  <div class="boletim-lista">
    ${crimesTexto || "Nenhum crime selecionado."}
  </div>
</div>

<div class="boletim-bloco">
  <h4>📌 VALORES BRUTOS</h4>
  <ul>
    <li>⏳ Pena Bruta: <strong>${penaBruta}</strong> meses</li>
    <li>💰 Multa Bruta: <strong>R$ ${multaBruta}</strong></li>
    <li>⚖️ Fiança Bruta: <strong>${fiancaPermitida ? "R$ "+fiancaBruta : "❌ Não permitida"}</strong></li>
  </ul>
</div>

<div class="boletim-bloco boletim-destaque">
  <h4>⚖️ VALORES APÓS ATENUANTES / AGRAVANTES</h4>
  <ul>
    <li>⏳ Pena Final: <strong>${penaFinal}</strong> meses</li>
    <li>💰 Multa Final: <strong>R$ ${multaFinal}</strong></li>
    <li>⚖️ Fiança Final: <strong>${fiancaFinal}</strong></li>
  </ul>
</div>
`;
}

fecharBoletim.onclick = () => {
  boletimModal.classList.add("hidden");
};

// ===================== RELATÓRIOS ===================== //

function gerarFichaCriminalDiscord() {

  let crimesTexto = "";

document.querySelectorAll("#crimeContainer .crime-item.selected").forEach(i => {
  const artigo = i.dataset.artigo;
  const nome = i.dataset.nome;
  const multa = Number(i.dataset.multa);

  if (!artigo || !nome) return; // segurança extra

  const fianca = i.dataset.fianca === "true"
    ? `R$ ${Math.floor(multa / 2)}`
    : "❌ Sem fiança";

  crimesTexto += `• **${artigo} – ${nome}**\n  💰 Multa: R$ ${multa} | ⚖️ Fiança: ${fianca}\n\n`;
});


  if (!crimesTexto) crimesTexto = "_Nenhum crime selecionado._";

  return `
📂 **FICHA CRIMINAL**

━━━━━━━━━━━━━━━━━━
👤 **DADOS DO RÉU**
━━━━━━━━━━━━━━━━━━
**Nome:** ${reuNome.value}  
**Passaporte:** ${reuPassaporte.value}  

━━━━━━━━━━━━━━━━━━
🚨 **CRIMES COMETIDOS**
━━━━━━━━━━━━━━━━━━
${crimesTexto}
━━━━━━━━━━━━━━━━━━
⚖️ **PENALIDADES**
━━━━━━━━━━━━━━━━━━
⏳ **Pena Total:** ${resultadoFinal.pena} meses  
💰 **Multa Total:** R$ ${resultadoFinal.multa}  
⚖️ **Fiança Total:** ${resultadoFinal.fianca}  

━━━━━━━━━━━━━━━━━━
👮 **GUARNIÇÃO**
━━━━━━━━━━━━━━━━━━
**Corporação:** ${guarnicao.value}  
**B.O.:** ${boAuto.value}  

**Oficial Responsável:**  
${oficialNome.value} (${oficialPassaporte.value})  

**Policiais Envolvidos:**  
${outrosOficiais.value || "Não informado"}  

━━━━━━━━━━━━━━━━━━
⚖️ **JURÍDICO**
━━━━━━━━━━━━━━━━━━
**Advogado:** ${advogadoNome.value || "Não informado"}  
**Delegado:** ${respNome.value || "Não informado"}  

━━━━━━━━━━━━━━━━━━
📝 **RELATÓRIO DA AÇÃO**
━━━━━━━━━━━━━━━━━━
(Descrever a ocorrência)
`;
}


// ===================== RESET APENAS CRIMES =====================
const resetCrimesBtn = document.getElementById("resetCrimes");

resetCrimesBtn.onclick = () => {

  // Remove seleção de todos os crimes
  document.querySelectorAll("#crimeContainer .crime-item.selected")
    .forEach(item => item.classList.remove("selected"));

  // Fecha todas as categorias
  document.querySelectorAll("#crimeContainer .crime-header")
    .forEach(h => h.classList.remove("open"));

  document.querySelectorAll("#crimeContainer .crime-lista")
    .forEach(l => l.classList.add("hidden"));

  // Zera apenas os resultados
  resultadoFinal = {
    pena: 0,
    multa: 0,
    fianca: ""
  };

  alert("🔄 Crimes limpos com sucesso.");
};

// ===================== TOOLTIP GLOBAL (CRIMES / AT / AG) =====================
const tooltip = document.getElementById("tooltip");

document.addEventListener("mousemove", (e) => {

  const crime = e.target.closest("#crimeContainer .crime-item");
  const efeito = e.target.closest("#atenuantesBtns .crime-item, #agravantesBtns .crime-item");

  // ===== CRIMES =====
  if (crime) {
    tooltip.innerHTML = `
      ⏳ Pena: <strong>${crime.dataset.meses}</strong> meses<br>
      💰 Multa: <strong>R$ ${crime.dataset.multa}</strong><br>
      ⚖️ Fiança: <strong>${crime.dataset.fianca === "true" ? "Permitida" : "❌ Sem fiança"}</strong>
    `;
    tooltip.style.opacity = "1";
  }

  // ===== ATENUANTES / AGRAVANTES =====
  else if (efeito) {
    const valor = efeito.dataset.value;
    tooltip.innerHTML = `
      ⚖️ Efeito:<br>
      <strong>${efeitosMapa[valor] || "Efeito não definido"}</strong>
    `;
    tooltip.style.opacity = "1";
  }

  // ===== FORA DE ITENS =====
  else {
    tooltip.style.opacity = "0";
  }

  tooltip.style.left = e.clientX + 15 + "px";
  tooltip.style.top  = e.clientY + 15 + "px";
});

document.querySelectorAll(
  ".crime-bloco:not(#crimeContainer .crime-bloco) .crime-header"
).forEach(header => {

  header.onclick = () => {
    header.classList.toggle("open");
    header.nextElementSibling.classList.toggle("hidden");
  };

});

