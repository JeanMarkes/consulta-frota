import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// ==============================
// CONFIGURAÇÃO SUPABASE
// ==============================
const supabaseUrl = 'https://cbzcucovyuuxqoyesffb.supabase.co';
const supabaseKey = 'sb_publishable_drt9tBqp5TaSpXnn3y5eFw_D5cC1cA7';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Script.js carregado com sucesso!");


// ==============================
// LOGIN
// ==============================
document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();
  const erroLogin = document.getElementById("login-error");

  erroLogin.classList.add("hide"); // Esconde erro antes de tentar login

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  if (error) {
    erroLogin.textContent = "Login ou senha inválidos";
    erroLogin.classList.remove("hide");
    return;
  }

  document.getElementById("login-screen").classList.remove("active");
  document.getElementById("main-screen").classList.add("active");
});



// ==============================
// CONSULTA
// ==============================
async function consultar() {

  let valor = document.getElementById("valor").value.trim().toUpperCase();
  const tipo = document.getElementById("tipo-pesquisa").value;

  if (!valor) {
    alert("Digite um valor para consultar!");
    return;
  }

  // ============================
  // CONSULTA POR PLACA
  // ============================
  if (tipo === 'placa') {

    valor = valor.replace(/-/g, '').slice(0, 7);

    const mapaNumeroParaLetra = {
      "0": "A",
      "1": "B",
      "2": "C",
      "3": "D",
      "4": "E",
      "5": "F",
      "6": "G",
      "7": "H",
      "8": "I",
      "9": "J"
    };

    const mapaLetraParaNumero = {
      "A": "0",
      "B": "1",
      "C": "2",
      "D": "3",
      "E": "4",
      "F": "5",
      "G": "6",
      "H": "7",
      "I": "8",
      "J": "9"
    };

    let placaAlternativa = valor;

    // Se for placa antiga (5º caractere número)
    if (!isNaN(valor[4])) {

      const letraConvertida = mapaNumeroParaLetra[valor[4]];

      if (letraConvertida) {
        placaAlternativa =
          valor.substring(0, 4) +
          letraConvertida +
          valor.substring(5);
      }

    } else {

      // Se for Mercosul (5º caractere letra)
      const numeroConvertido = mapaLetraParaNumero[valor[4]];

      if (numeroConvertido) {
        placaAlternativa =
          valor.substring(0, 4) +
          numeroConvertido +
          valor.substring(5);
      }
    }

    const { data, error } = await supabase
      .from('veiculos')
      .select('*')
      .in('placa', [valor, placaAlternativa]);

    if (error) {
      alert("Erro na consulta: " + error.message);
      return;
    }

    exibirResultados(data);
    return;
  }

  // ============================
  // CONSULTA POR ORDEM
  // ============================
  if (tipo === 'ordem') {

    valor = valor.slice(0, 5);

    const { data, error } = await supabase
      .from('veiculos')
      .select('*')
      .eq('ordem', valor);

    if (error) {
      alert("Erro na consulta: " + error.message);
      return;
    }

    exibirResultados(data);
  }
}


// ==============================
// EXIBIR RESULTADOS
// ==============================
function exibirResultados(data) {

  document.getElementById("lista-resultados").classList.add("hide");
  document.getElementById("resultado").classList.add("hide");
  document.getElementById("no-result").classList.add("hide");

  if (!data || data.length === 0) {
    document.getElementById("no-result").classList.remove("hide");
    return;
  }

  const listaItens = document.getElementById("lista-itens");
  listaItens.innerHTML = '';

  data.forEach(veiculo => {

    const card = document.createElement("div");
    card.className = "resultado-card";

    card.innerHTML = `
      <div class="card-header">
        <strong>Nº Ordem: ${veiculo.ordem}</strong>
      </div>
      <div class="card-body">
        <p><strong>Unidade:</strong> ${veiculo.unidade || '-'}</p>
        <p><strong>Placa:</strong> ${veiculo.placa || '-'}</p>
      </div>
    `;

    card.addEventListener('click', () => preencherDetalhes(veiculo));
    listaItens.appendChild(card);
  });

  document.getElementById("lista-resultados").classList.remove("hide");

  if (data.length === 1) {
    preencherDetalhes(data[0]);
  }
}


// ==============================
// DETALHES
// ==============================
function preencherDetalhes(veiculo) {

  document.getElementById("res-ordem").textContent = veiculo.ordem || '-';
  document.getElementById("res-placa").textContent = veiculo.placa || '-';
  document.getElementById("res-chassi").textContent = veiculo.chassi || '-';
  document.getElementById("res-renavam").textContent = veiculo.renavam || '-';
  document.getElementById("res-unidade").textContent = veiculo.unidade || '-';
  document.getElementById("res-fab").textContent = veiculo.fab || '-';
  document.getElementById("res-mod").textContent = veiculo.mod || '-';
  document.getElementById("res-marca").textContent = veiculo.marca || '-';
  document.getElementById("res-modelo").textContent = veiculo.modelo || '-';
  document.getElementById("res-tipo").textContent = veiculo.tipo || '-';
  document.getElementById("res-carroceria").textContent = veiculo.carroceria || '-';
  document.getElementById("res-cor").textContent = veiculo.cor || '-';
  document.getElementById("res-municipio").textContent = veiculo.municipio || '-';
  document.getElementById("res-cnpj").textContent = veiculo.cnpj || '-';
  document.getElementById("res-empresa").textContent = veiculo.empresa || '-';
  document.getElementById("res-placa-antiga").textContent = veiculo.placa_antiga || '-';
  document.getElementById("res-crlv").textContent = veiculo.crlv_atual || '-';
  document.getElementById("res-ultima").textContent = veiculo.ultima_atualizacao || '-';

  document.getElementById("resultado").classList.remove("hide");
}

document.getElementById("btn-consultar").addEventListener("click", consultar);


// ==============================
// MENU
// ==============================
const toggle = document.getElementById('sidebar-toggle');
const menu = document.getElementById('sidebar-menu');

toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

document.addEventListener('click', (e) => {
  if (!toggle.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('active');
  }
});

document.getElementById('logout-link').addEventListener('click', async (e) => {
  e.preventDefault();

  await supabase.auth.signOut();

  document.getElementById("main-screen").classList.remove("active");
  document.getElementById("login-screen").classList.add("active");

  menu.classList.remove('active');
  document.getElementById("valor").value = '';

  document.getElementById("resultado").classList.add("hide");
  document.getElementById("lista-resultados").classList.add("hide");
  document.getElementById("no-result").classList.add("hide");
});
