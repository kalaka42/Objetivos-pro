const STORAGE_KEY = "objetivos-pro-v1";
const $ = (id) => document.getElementById(id);
let goals = loadGoals();

function loadGoals() {
  try {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(data) ? data.filter(g => g && typeof g.name === "string" && Number.isFinite(g.target) && Number.isFinite(g.done)) : [];
  } catch { return []; }
}
function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
    $("saveStatus").textContent = "✓ Guardado en este dispositivo";
  } catch {
    $("saveStatus").textContent = "No se pudo guardar";
  }
}
function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}
function render() {
  const total = goals.reduce((sum,g) => sum + g.target, 0);
  const done = goals.reduce((sum,g) => sum + g.done, 0);
  const completed = goals.filter(g => g.done >= g.target).length;
  const percent = total ? Math.round(done / total * 100) : 0;
  $("totalProgress").innerHTML = `${done}<span> / ${total}</span>`;
  $("overallBar").style.width = `${Math.min(100,percent)}%`;
  $("overallPercent").textContent = `${percent}% completado`;
  $("completedGoals").innerHTML = `${completed} <span>/ ${goals.length}</span>`;
  const filter = $("filter").value;
  const shown = goals.filter(g => filter === "all" || (filter === "active" ? g.done < g.target : g.done >= g.target));
  $("goalList").innerHTML = shown.map(g => {
    const p = Math.min(100, Math.round(g.done/g.target*100));
    const isDone = g.done >= g.target;
    return `<article class="goal-card">
      <div class="goal-top">
        <div class="goal-symbol">${isDone ? "✓" : "◎"}</div>
        <div class="goal-title-wrap"><h3 class="goal-title">${escapeHTML(g.name)}</h3><div class="goal-sub">${isDone ? '<span class="completed-tag">✓ Meta conseguida</span>' : `${g.target-g.done} por completar`}</div></div>
        <button class="delete-button" data-delete="${g.id}" aria-label="Eliminar ${escapeHTML(g.name)}" title="Eliminar objetivo">×</button>
      </div>
      <div class="goal-count-row"><div class="goal-count">${g.done} <span>/ ${g.target}</span></div><span class="percent">${p}%</span></div>
      <div class="progress-track"><div class="progress-fill" style="width:${p}%;${isDone?'background:linear-gradient(90deg,#4bc99a,#8af0c6)':''}"></div></div>
      <div class="goal-actions"><button class="step-button" data-minus="${g.id}" ${g.done<=0?'disabled':''} aria-label="Restar uno">−</button><button class="primary-button" data-plus="${g.id}" ${isDone?'disabled':''}>${isDone?'Objetivo completado ✓':'+1 Hecho  →'}</button></div>
    </article>`;
  }).join("");
  $("emptyState").classList.toggle("hidden", goals.length > 0);
  $("goalList").classList.toggle("hidden", shown.length === 0);
  if (goals.length && shown.length === 0) {
    $("goalList").innerHTML = '<div class="empty-state"><h3>No hay objetivos aquí</h3><p>Prueba con otro filtro.</p></div>';
    $("goalList").classList.remove("hidden");
  }
}
$("openModal").addEventListener("click", () => { $("goalDialog").showModal(); setTimeout(()=>$("goalName").focus(),50); });
$("emptyAdd").addEventListener("click", () => $("openModal").click());
$("closeModal").addEventListener("click", () => $("goalDialog").close());
$("goalForm").addEventListener("submit", e => {
  e.preventDefault();
  const name = $("goalName").value.trim();
  const target = Number($("goalTarget").value);
  if (!name || !Number.isInteger(target) || target < 1 || target > 100000) return;
  goals.unshift({id: (globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random()}`), name, target, done: 0, createdAt: new Date().toISOString()});
  save(); render(); $("goalForm").reset(); $("goalTarget").value = "10"; $("goalDialog").close();
});
$("goalList").addEventListener("click", e => {
  const plus = e.target.closest("[data-plus]");
  const minus = e.target.closest("[data-minus]");
  const del = e.target.closest("[data-delete]");
  if (plus) goals = goals.map(g => String(g.id) === plus.dataset.plus ? {...g,done:Math.min(g.target,g.done+1)} : g);
  if (minus) goals = goals.map(g => String(g.id) === minus.dataset.minus ? {...g,done:Math.max(0,g.done-1)} : g);
  if (del) {
    const g = goals.find(g => String(g.id) === del.dataset.delete);
    if (g && confirm(`¿Eliminar el objetivo "${g.name}"?`)) goals = goals.filter(x => String(x.id) !== del.dataset.delete);
  }
  save(); render();
});
$("filter").addEventListener("change", render);
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(()=>{}));
}
render();
