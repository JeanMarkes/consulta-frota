// Instale o cliente Supabase (não precisa instalar, só importe)
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Substitua com suas chaves do Supabase
const supabaseUrl = 'https://cbzcucovyuuxqoyesffb.supabase.co';  // ex: https://xyz.supabase.co
const supabaseKey = 'sb_publishable_drt9tBqp5TaSpXnn3y5eFw_D5cC1cA7';      // a chave longa
const supabase = createClient(supabaseUrl, supabaseKey);

// Login (substitua o mock anterior)
document.getElementById("login-form").addEventListener("submit", async function(e) {
  e.preventDefault();

  const email = document.getElementById("usuario").value.trim();  // Use email como login
  const senha = document.getElementById("senha").value.trim();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: senha,
  });

  if (error) {
    alert("Login ou senha incorretos! " + error.message);
    return;
  }

  document.getElementById("nome-usuario").textContent = email.split('@')[0];  // Mostra parte do email como nome
  document.getElementById("login-screen").classList.remove("active");
  document.getElementById("main-screen").classList.add("active");
});

// Consulta
async function consultar() {
  const tipo = document.getElementById("tipo-pesquisa").value;
  const valor = document.getElementById("valor").value.trim().toUpperCase();

  if (!valor) {
    alert("Digite um valor para consultar!");
    return;
  }

  const coluna = tipo === 'placa' ? 'placa' : 'ordem';

  const { data, error } = await supabase
    .from('veiculos')
    .select('*')
    .eq(coluna, valor)
    .single();  // Pega um registro

  if (error || !data) {
    alert("Não encontrado ou erro: " + (error ? error.message : ''));
    return;
  }

  // Preenche os campos
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
