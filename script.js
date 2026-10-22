const form = document.getElementById("formTarefa");
const nome = document.getElementById("nomeTarefa");
const prioridade = document.getElementById("prioridade");
const prazo = document.getElementById("prazo");
const lista = document.getElementById("listaTarefas");
const vazio = document.getElementById("vazio");

let tarefas = JSON.parse(
  localStorage.getItem("tarefasListaFacil") || "[]"
);

let filtroAtual = "todas";

function salvar() {
  localStorage.setItem(
    "tarefasListaFacil",
    JSON.stringify(tarefas)
  );
}

function atualizar() {
  lista.innerHTML = "";

  const exibidas = tarefas.filter(t => {
    if (filtroAtual === "pendentes") return !t.concluida;
    if (filtroAtual === "concluidas") return t.concluida;
    return true;
  });

  vazio.hidden = exibidas.length > 0;
  vazio.textContent = tarefas.length === 0
    ? "Nenhuma tarefa cadastrada ainda."
    : "Nenhuma tarefa encontrada nesse filtro.";

  exibidas.forEach(tarefa => {
    const item = document.createElement("div");
    item.className = "tarefa";

    if (tarefa.concluida) {
      item.classList.add("concluida");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = tarefa.concluida;
    checkbox.setAttribute(
      "aria-label",
      "Marcar tarefa como concluída"
    );

    checkbox.addEventListener("change", () => {
      tarefa.concluida = checkbox.checked;
      salvar();
      atualizar();
    });

    const detalhes = document.createElement("div");
    detalhes.className = "detalhes";

    const titulo = document.createElement("p");
    titulo.textContent = tarefa.nome;

    const informacoes = document.createElement("small");
    informacoes.textContent =
      "Prioridade: " + tarefa.prioridade +
      (tarefa.prazo
        ? " | Prazo: " + tarefa.prazo.split("-").reverse().join("/")
        : "");

    detalhes.append(titulo, informacoes);

    const excluir = document.createElement("button");
    excluir.className = "excluir";
    excluir.textContent = "✕";
    excluir.setAttribute("aria-label", "Excluir tarefa");

    excluir.addEventListener("click", () => {
      tarefas = tarefas.filter(t => t.id !== tarefa.id);
      salvar();
      atualizar();
    });

    item.append(checkbox, detalhes, excluir);
    lista.appendChild(item);
  });

  const concluidas = tarefas.filter(t => t.concluida).length;
  document.getElementById("concluidas").textContent = concluidas;
  document.getElementById("total").textContent = tarefas.length;

  const porcentagem = tarefas.length
    ? (concluidas / tarefas.length) * 100
    : 0;

  document.getElementById("barra").style.width =
    porcentagem + "%";
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const texto = nome.value.trim();
  if (!texto) return;

  tarefas.unshift({
    id: Date.now().toString() + Math.random(),
    nome: texto,
    prioridade: prioridade.value,
    prazo: prazo.value,
    concluida: false
  });

  salvar();
  form.reset();
  filtroAtual = "todas";
  atualizar();
});

document.querySelectorAll("[data-filtro]").forEach(botao => {
  botao.addEventListener("click", () => {
    filtroAtual = botao.dataset.filtro;
    atualizar();
  });
});

document.getElementById("limpar").addEventListener("click", () => {
  tarefas = tarefas.filter(t => !t.concluida);
  salvar();
  atualizar();
});

document.getElementById("temaBtn").addEventListener("click", () => {
  document.body.classList.toggle("escuro");

  const escuro = document.body.classList.contains("escuro");
  document.getElementById("temaBtn").textContent =
    escuro ? "☀️" : "🌙";

  localStorage.setItem("temaListaFacil", escuro ? "escuro" : "claro");
});

if (localStorage.getItem("temaListaFacil") === "escuro") {
  document.body.classList.add("escuro");
  document.getElementById("temaBtn").textContent = "☀️";
}

atualizar();