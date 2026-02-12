import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Chaves Supabase
const supabaseUrl = 'https://cbzcucovyuuxqoyesffb.supabase.co';
const supabaseKey = 'sb_publishable_drt9tBqp5TaSpXnn3y5eFw_D5cC1cA7'; // COLE A CHAVE PUBLISHABLE INTEIRA AQUI!
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Script.js carregou com sucesso!");

// Variável global para role
let currentRole = 'comum';

// Login
document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();
  const email = document.getElementById("usuario").value.trim();
  const senha = document.getElementById("senha").value.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  if (error) {
    alert("Login ou senha incorretos! " + error.message);
    return;
  }

  // Busca role do usuário
  const { data: userData, error: userError } = await supabase
    .from('usuarios')
    .select('role')
    .eq('email', email)
    .single();

  if (!userError && userData) {
    currentRole = userData.role || 'comum';
  } else {
    currentRole = 'comum';
  }

  // Mostra menu de gerenciamento só para admin
  if (currentRole === 'admin') {
    document.getElementById("menu-gerenciar").classList.remove("hide");
  } else {
    document.getElementById("menu-gerenciar").classList.add("hide");
  }

  document.getElementById("login-screen").classList.remove("active");
  document.getElementById("main-screen").classList.add("active");
});

// Consulta múltipla
async function consultar() {
  let valor = document.getElementById("valor").value.trim().toUpperCase();
  const tipo = document.getElementById("tipo-pesquisa").value;
  const coluna = tipo === 'placa' ? 'placa' : 'ordem';

  if (!valor) {
    alert("Digite um valor para consultar!");
    return;
  }

  if (tipo === 'placa') {
    valor = valor.replace(/-/g, '');
    valor = valor.slice(0, 8);
  } else if (tipo === 'ordem') {
    valor = valor.slice(0, 5);
  }

  const { data, error } = await supabase
    .from('veiculos')
    .select('*')
    .eq(coluna, valor);

  if (error) {
    alert("Erro na consulta: " + error.message);
    return;
  }

  document.getElementById("lista-resultados").classList.add("hide");
  document.getElementById("resultado").classList.add("hide");
  document.getElementById("no-result").classList.add("hide");

  if (data.length === 0) {
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
        <strong>Nº Ordem: ${veiculo.ordem || '-'}</strong>
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

  document.getElementById("resultado").classList.remove("hide");
}

document.getElementById("btn-consultar").addEventListener("click", consultar);

// Função para mostrar tela de gerenciamento
function mostrarGerenciarUsuarios() {
  console.log("Função mostrarGerenciarUsuarios chamada"); // Log para debug
  document.getElementById("lista-resultados").classList.add("hide");
  document.getElementById("resultado").classList.add("hide");
  document.getElementById("no-result").classList.add("hide");
  document.getElementById("gerenciar-usuarios").classList.remove("hide");
  carregarListaUsuarios();
}

// Carrega lista de usuários
async function carregarListaUsuarios() {
  const { data, error } = await supabase.from('usuarios').select('*');
  if (error) {
    alert("Erro ao carregar usuários: " + error.message);
    return;
  }

  const lista = document.getElementById("lista-usuarios");
  lista.innerHTML = '';
  data.forEach(u => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${u.email}</strong> - Role: ${u.role}`;
    lista.appendChild(div);
  });
}

// Menu hambúrguer
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
  document.getElementById("gerenciar-usuarios").classList.add("hide");
});
