const URL_DA_LISTA = "https://www.dropbox.com/s/abc123/lista.txt?dl=1"; // ← Altere para o link direto do seu .txt

async function carregarLista() {
  const res = await fetch(URL_DA_LISTA);
  const texto = await res.text();

  const linhas = texto.split('\n');
  const canais = [];
  let atual = {};

  for (let linha of linhas) {
    linha = linha.trim();
    if (linha.startsWith("#EXTINF")) {
      const grupo = extrair(linha, 'group-title="', '"') || "Outros";
      const logo = extrair(linha, 'tvg-logo="', '"') || "";
      const nome = linha.split(',').pop().trim();
      atual = { grupo, logo, nome };
    } else if (linha && linha.startsWith("http")) {
      atual.url = linha;
      canais.push({ ...atual });
    }
  }

  const gruposUnicos = [...new Set(canais.map(c => c.grupo))];
  const filtros = document.getElementById('filtros');
  const lista = document.getElementById('lista');
  const player = document.getElementById('player');

  filtros.innerHTML = '';
  gruposUnicos.forEach(grupo => {
    const btn = document.createElement('button');
    btn.textContent = grupo;
    btn.onclick = () => mostrarGrupo(grupo);
    filtros.appendChild(btn);
  });

  function mostrarGrupo(grupoSelecionado) {
    lista.innerHTML = '';
    canais.filter(c => c.grupo === grupoSelecionado).forEach(canal => {
      const div = document.createElement('div');
      div.className = 'item';
      div.innerHTML = `
        <img src="${canal.logo}" alt="${canal.nome}">
        <h3>${canal.nome}</h3>
      `;
      div.onclick = () => {
        player.src = canal.url;
        player.style.display = 'block';
        window.scrollTo({ top: player.offsetTop - 80, behavior: 'smooth' });
      };
      lista.appendChild(div);
    });
  }

  if (gruposUnicos.length > 0) {
    mostrarGrupo(gruposUnicos[0]);
  }
}

function extrair(texto, inicio, fim) {
  const ini = texto.indexOf(inicio);
  if (ini === -1) return "";
  const fimIdx = texto.indexOf(fim, ini + inicio.length);
  return texto.substring(ini + inicio.length, fimIdx);
}
