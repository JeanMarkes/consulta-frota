import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Chaves do Supabase (cole a publishable completa aqui)
const supabaseUrl = 'https://cbzcucovyuuxqoyesffb.supabase.co';
const supabaseKey = 'sb_publishable_drt9tBqp5TaSpXnn3y5eFw_D5cC1cA7'; // ← COLE A CHAVE INTEIRA AQUI!
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Script.js carregou com sucesso! Supabase client criado.");

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
  
  document.getElementById("login-screen").classList.remove("active");
  document.getElementById("main-screen").classList.add("active");
});

// Consulta
async function consultar() {
  console.log("Função consultar() foi chamada!");
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
    valor = valor.slice(0, 5); // Limite de 5 caracteres (ajuste se precisar de mais)
  }

  console.log("Valor tratado para busca:", valor);

  const { data, error } = await supabase
    .from('veiculos')
    .select('*')
    .eq(coluna, valor)
    .maybeSingle();

  console.log("Buscando por:", coluna, "valor:", valor);
  console.log("Resultado:", data);
  console.log("Erro:", error);

  if (error) {
    alert("Erro na consulta: " + error.message);
    return;
  }

  if (!data) {
    alert("Veículo não encontrado com o valor informado.");
    return;
  }

  document.getElementById("res-ordem").textContent = data.ordem || '-';
  document.getElementById("res-placa").textContent = data.placa || '-';
  document.getElementById("res-chassi").textContent = data.chassi || '-';
  document.getElementById("res-renavam").textContent = data.renavam || '-';
  document.getElementById("res-unidade").textContent = data.unidade || '-';
  document.getElementById("res-fab").textContent = data.fab || '-';
  document.getElementById("res-mod").textContent = data.mod || '-';
  document.getElementById("res-marca").textContent = data.marca || '-';
  document.getElementById("res-modelo").textContent = data.modelo || '-';
  document.getElementById("res-tipo").textContent = data.tipo || '-';
  document.getElementById("res-carroceria").textContent = data.carroceria || '-';
  document.getElementById("res-cor").textContent = data.cor || '-';
  document.getElementById("res-municipio").textContent = data.municipio || '-';
  document.getElementById("res-cnpj").textContent = data.cnpj || '-';
  document.getElementById("res-empresa").textContent = data.empresa || '-';
  document.getElementById("res-placa-antiga").textContent = data.placa_antiga || '-';
  document.getElementById("res-crlv").textContent = data.crlv_atual || '-';

  document.getElementById("resultado").classList.remove("hide");
}

document.getElementById("btn-consultar").addEventListener("click", consultar);
console.log("Listener adicionado ao botão Consultar.");

// Menu hambúrguer
const toggle = document.getElementById('sidebar-toggle');
const menu = document.getElementById('sidebar-menu');

toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// Fechar ao clicar fora
document.addEventListener('click', (e) => {
  if (!toggle.contains(e.target) && !menu.contains(e.target)) {
    menu.classList.remove('active');
  }
});

// Logout
document.getElementById('logout-link').addEventListener('click', async (e) => {
  e.preventDefault();
  await supabase.auth.signOut();
  document.getElementById("main-screen").classList.remove("active");
  document.getElementById("login-screen").classList.add("active");
  menu.classList.remove('active');
  document.getElementById("valor").value = '';
  document.getElementById("resultado").classList.add("hide");
});
