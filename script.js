// Usuário e senha fictícios para teste
const USUARIO_CORRETO = "admin";
const SENHA_CORRETA   = "123456";

document.getElementById("login-form").addEventListener("submit", function(e) {
  e.preventDefault();

  const usuario = document.getElementById("usuario").value.trim();
  const senha   = document.getElementById("senha").value.trim();

  if (usuario === USUARIO_CORRETO && senha === SENHA_CORRETA) {
    document.getElementById("nome-usuario").textContent = usuario;
    document.getElementById("login-screen").classList.remove("active");
    document.getElementById("main-screen").classList.add("active");
  } else {
    alert("Login ou senha incorretos!");
  }
});

function consultar() {
  const tipo  = document.getElementById("tipo-pesquisa").value;
  const valor = document.getElementById("valor").value.trim();

  if (!valor) {
    alert("Digite um valor para consultar!");
    return;
  }

  // Aqui você colocaria a chamada fetch() para sua API real
  // Por enquanto vamos mostrar dados fictícios

  const dadosMock = {
    ordem: "123456",
    placa: "ABC1D23",
    chassi: "9BWZZZ377VT001234",
    renavam: "12345678901",
    unidade: "BH-01",
    fab: "2020",
    mod: "2021",
    marca: "Volkswagen",
    modelo: "Gol G8",
    tipo: "Particular",
    carroceria: "Hatch",
    cor: "Prata",
    municipio: "Nova Lima / MG",
    cnpj: "12.345.678/0001-99",
    empresa: "Transportes XYZ Ltda",
    placaAntiga: "XYZ-9999",
    crlv: "2025 - Em dia"
  };

  // Preenche os campos
  document.getElementById("res-ordem").textContent        = dadosMock.ordem;
  document.getElementById("res-placa").textContent        = tipo === "placa" ? valor.toUpperCase() : dadosMock.placa;
  document.getElementById("res-chassi").textContent       = dadosMock.chassi;
  document.getElementById("res-renavam").textContent      = dadosMock.renavam;
  document.getElementById("res-unidade").textContent      = dadosMock.unidade;
  document.getElementById("res-fab").textContent          = dadosMock.fab;
  document.getElementById("res-mod").textContent          = dadosMock.mod;
  document.getElementById("res-marca").textContent        = dadosMock.marca;
  document.getElementById("res-modelo").textContent       = dadosMock.modelo;
  document.getElementById("res-tipo").textContent         = dadosMock.tipo;
  document.getElementById("res-carroceria").textContent   = dadosMock.carroceria;
  document.getElementById("res-cor").textContent          = dadosMock.cor;
  document.getElementById("res-municipio").textContent    = dadosMock.municipio;
  document.getElementById("res-cnpj").textContent         = dadosMock.cnpj;
  document.getElementById("res-empresa").textContent      = dadosMock.empresa;
  document.getElementById("res-placa-antiga").textContent = dadosMock.placaAntiga;
  document.getElementById("res-crlv").textContent         = dadosMock.crlv;

  document.getElementById("resultado").classList.remove("hide");
}
