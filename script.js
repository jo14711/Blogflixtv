const listaURL = "https://www.dropbox.com/scl/fi/abc123/minha-lista.txt?rlkey=xyz123&dl=1"; // 👈 Coloque o seu link aqui
let canais = [];

async function carregarLista() {
  const res = await fetch(listaURL);
  const texto = await res.text();
  canais = parseM3U(texto);
  const categorias = [...new Set(canais.map(c => c.group))];
  renderFiltros(categorias);
  renderCanais("Todos");
}

function parseM3U(texto) {
  const linhas = texto.split('\n');
  const canais = [];
  for (let i = 0; i < linhas.length; i++) {
    if (linhas[i].startsWith('#EXTINF:')) {
      const grupo = linhas[i].match(/group-title="([^"]+)"/)?.[1] || "Outros";
      const logo = linhas[i].match(/tvg-logo="([^"]+)"/)?.[1] || "";
      const nome = linhas[i].split(',').pop().trim();
      const url = linhas[i + 1]?.trim();
      if (url && url.startsWith('http')) {
        canais.push({ nome, url, logo, group: grupo });
      }
    }
  }
  return canais;
}

function renderFiltros(categorias) {
  const filtros = document.getElementById("filtros");
  filtros.innerHTML = `<button onclick="renderCanais('Todos')">Todos</button>`;
  categorias.forEach(cat => {
    filtros.innerHTML += `<button onclick="renderCanais('${cat}')">${cat}</button>`;
  });
}

function renderCanais(filtro) {
  const lista = document.getElementById("lista");
  lista.innerHTML = "";
  const filtrados = filtro === "Todos" ? canais : canais.filter(c => c.group === filtro);
  filtrados.forEach(c => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <img src="${c.logo}" alt="${c.nome}">
      <h3>${c.nome}</h3>
    `;
    div.onclick = () => tocar(c.url);
    lista.appendChild(div);
  });
}

function tocar(url) {
  const player = document.getElementById("player");
  if (url.endsWith(".mp4") || url.endsWith(".m3u8") || url.endsWith(".ts")) {
    player.src = `https://videojs-player.vercel.app/?src=${encodeURIComponent(url)}`;
    player.style.display = "block";
    player.scrollIntoView({ behavior: "smooth" });
  } else {
    alert("Link inválido ou não suportado.");
  }
}

carregarLista();
