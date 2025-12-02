<script>
    /* TABS */
    const tabButtons = document.querySelectorAll(".tab-button");
    const tabPanels = document.querySelectorAll(".tab-panel");
    tabButtons.forEach(btn=>{
      btn.addEventListener("click",()=>{
        const targetId = btn.getAttribute("data-tab");
        tabButtons.forEach(b=>b.classList.remove("active"));
        btn.classList.add("active");
        tabPanels.forEach(p=>p.classList.toggle("active",p.id===targetId));
      });
    });
    

    /* ELEMENTOS GLOBAIS */
   // ===== ELEMENTOS DO CABEÇALHO =====
const daySelect = document.getElementById("daySelect");
const energyChips = document.getElementById("energyChips");
const contextChips = document.getElementById("contextChips");
const btnRestartCycle = document.getElementById("btnRestartCycle"); // 👈 AQUI

/* ===== MODAL GENÉRICO (reutilizado em alimentação + exercícios) ===== */

const genericEditModal = document.getElementById("genericEditModal");
const genericEditModalTitle = document.getElementById("genericEditModalTitle");
const genericEditName = document.getElementById("genericEditName");
const genericEditInstr = document.getElementById("genericEditInstr");
const genericEditCancel = document.getElementById("genericEditCancel");
const genericEditSave = document.getElementById("genericEditSave");

let currentGenericEdit = null; 
// { title, initialName, initialInstr, onSave }

function openGenericEditModal(config) {
  currentGenericEdit = config || null;
  genericEditModalTitle.textContent = config.title || "Editar";
  genericEditName.value = config.initialName || "";
  genericEditInstr.value = config.initialInstr || "";
  genericEditModal.classList.add("active");
  genericEditName.focus();
}

function closeGenericEditModal() {
  genericEditModal.classList.remove("active");
  currentGenericEdit = null;
}

if (genericEditCancel) {
  genericEditCancel.addEventListener("click", closeGenericEditModal);
}

if (genericEditSave) {
  genericEditSave.addEventListener("click", () => {
    if (!currentGenericEdit) {
      closeGenericEditModal();
      return;
    }
    const newName = genericEditName.value.trim();
    const newInstr = genericEditInstr.value.trim();

    if (!newName) {
      alert("Digite um nome antes de salvar.");
      return;
    }

    try {
      currentGenericEdit.onSave(newName, newInstr);
    } finally {
      closeGenericEditModal();
    }
  });
}

// Fecha ao clicar fora do card
if (genericEditModal) {
  genericEditModal.addEventListener("click", (e) => {
    if (e.target === genericEditModal) {
      closeGenericEditModal();
    }
  });
}


for(let i=1;i<=14;i++){
      const opt=document.createElement("option");
      opt.value=i;
      opt.textContent=`Dia ${i} (${getWeekdayLabel(i)})`;
      daySelect.appendChild(opt);
    }
    daySelect.addEventListener("change",()=>renderAll());

if (energyChips) {
  energyChips.addEventListener("click", (ev) => {
    const chip = ev.target.closest(".chip");
    if (!chip) return;
    const energy = chip.getAttribute("data-energy");
    setEnergyMeta(energy);
    renderAll();
  });
}

if (contextChips) {
  contextChips.addEventListener("click", (ev) => {
    const chip = ev.target.closest(".chip");
    if (!chip) return;
    const ctx = chip.getAttribute("data-context");
    setContextMeta(ctx);
    renderAll();
  });
}

/* ⭐⭐⭐ AQUI ENTRA O SEU TRECHO ⭐⭐⭐ */
if (btnRestartCycle) {
  btnRestartCycle.addEventListener("click", restartCycle);
}




    // Alimentação
    const foodContent = document.getElementById("foodContent");
    const foodStats = document.getElementById("foodStats");
    const badgeFoodDia = document.getElementById("badgeFoodDia");
    const badgeFoodResumo = document.getElementById("badgeFoodResumo");

    // Exercícios
    const exerciseContent = document.getElementById("exerciseContent");
    const exerciseStats = document.getElementById("exerciseStats");
    const badgeExDia = document.getElementById("badgeExDia");
    const badgeExResumo = document.getElementById("badgeExResumo");
    const exContextLabel = document.getElementById("exContextLabel");
    const btnDownloadExResumo = document.getElementById("btnDownloadExResumo");

    // Casa
    const domesticContent = document.getElementById("domesticContent");
    const flexContent = document.getElementById("flexContent");
    const badgeCasaDia = document.getElementById("badgeCasaDia");
    const badgeFlexCount = document.getElementById("badgeFlexCount");
    const statsContent = document.getElementById("statsContent");
    const btnResetCasa = document.getElementById("btnResetCasa");
    const badgeCasaResumo = document.getElementById("badgeStatsPeriodo");
    const casaContextLabel = document.getElementById("casaContextLabel");
    const cycleHistoryContent = document.getElementById("cycleHistoryContent");
const btnDownloadCycleHistory = document.getElementById("btnDownloadCycleHistory");

    
    /* MODAL DE EDIÇÃO */
let editTaskModal = document.getElementById("editTaskModal");
let editTaskName = document.getElementById("editTaskName");
let editTaskInstr = document.getElementById("editTaskInstr");
let editTaskTipo = document.getElementById("editTaskTipo");
let editTaskSaveBtn = document.getElementById("editTaskSaveBtn");
let editTaskCancelBtn = document.getElementById("editTaskCancelBtn");

let currentEdit = null; // guarda info temporária da tarefa


    /* ESTADO */
    const STORAGE_KEY = "app_fibro_estado_v4";
    let state = {
  dayMeta: {},
  energyMeta: {},
  foodState: {},
  foodOptionsState: null,
  exState: {},
  exOptionsState: null,
  domesticDone: {},
  domesticIgnored: {},
  domesticReagendado: {},
  domesticCustom: {},
  domesticDeleted: {},   // 👈 NOVO
  flexList: [],
  flexHistory: [],
  cycleHistory: []
};


   function loadState(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw) return;
    const parsed = JSON.parse(raw);
    state = Object.assign(state, parsed || {});
    state.cycleHistory = parsed.cycleHistory || [];
    state.domesticDeleted = parsed.domesticDeleted || {}; // 👈 garante o novo campo
  }catch(e){ console.warn("Erro ao carregar estado:",e); }
}

    
    function persistState(){
      try{
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      }catch(e){ console.warn("Erro ao salvar estado:",e); }
    }
   function restartCycle() {
  const ok = confirm(
    "Reiniciar ciclo de 14 dias?\n\n" +
    "• O ciclo atual será arquivado no histórico.\n" +
    "• As marcações de alimentação, exercícios e casa serão limpas.\n" +
    "• As opções de comida, exercícios e tarefas personalizadas serão mantidas."
  );
  if (!ok) return;

  if (!state.cycleHistory) state.cycleHistory = [];

  const snapshot = {
    timestamp: new Date().toISOString(),
    dayMeta: state.dayMeta,
    energyMeta: state.energyMeta,
    foodState: state.foodState,
    exDone: state.exDone,
    domesticDone: state.domesticDone,
    domesticIgnored: state.domesticIgnored,
    domesticReagendado: state.domesticReagendado,
    flexHistory: state.flexHistory
  };

  state.cycleHistory.push(snapshot);

  // limpa dados “do ciclo”
  state.dayMeta = {};
  state.energyMeta = {};
  state.foodState = {};
  state.exDone = {};
  state.domesticDone = {};
  state.domesticIgnored = {};
  state.domesticReagendado = {};
  state.flexList = [];
  state.flexHistory = [];

  // volta para Dia 1, Alta, Casa
  daySelect.value = "1";

  Array.from(energyChips.querySelectorAll(".chip")).forEach((c) => {
    c.classList.toggle("active", c.getAttribute("data-energy") === "alta");
  });

  Array.from(contextChips.querySelectorAll(".chip")).forEach((c) => {
    c.classList.toggle("active", c.getAttribute("data-context") === "casa");
  });

  persistState();
  renderAll && renderAll();
}


    /* DIA / ENERGIA / CONTEXTO */
    function getWeekdayLabel(day){
      const labels=["5ª","6ª","S","D","2ª","3ª","4ª"];
      return labels[(day-1)%7];
    }
    function getSelectedDay(){ return parseInt(daySelect.value,10)||1; }
    function getDayEnergy(day){ return state.energyMeta[day] || "alta"; }
    function setDayEnergy(day,val){ state.energyMeta[day]=val; persistState(); }
    function getDayContext(day){ return state.dayMeta[day] || "casa"; }
    function setDayContext(day,val){ state.dayMeta[day]=val; persistState(); }

    for(let i=1;i<=14;i++){
      const opt=document.createElement("option");
      opt.value=i;
      opt.textContent=`Dia ${i} (${getWeekdayLabel(i)})`;
      daySelect.appendChild(opt);
    }
    daySelect.addEventListener("change",()=>renderAll());

    energyChips.addEventListener("click",e=>{
      const btn=e.target.closest(".chip"); if(!btn) return;
      const energy=btn.getAttribute("data-energy");
      const day=getSelectedDay();
      setDayEnergy(day,energy);
      energyChips.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c===btn));
      renderAll();
    });

    contextChips.addEventListener("click",e=>{
      const btn=e.target.closest(".chip"); if(!btn) return;
      const ctx=btn.getAttribute("data-context");
      const day=getSelectedDay();
      setDayContext(day,ctx);
      contextChips.querySelectorAll(".chip").forEach(c=>c.classList.toggle("active",c===btn));
      renderAll();
    });

    if(btnResetCasa){
      btnResetCasa.addEventListener("click",()=>{
        if(!confirm("Resetar TODOS os dados de CASA?")) return;
        state.domesticDone={};
        state.domesticIgnored={};
        state.domesticReagendado={};
        state.domesticCustom={};
        state.flexList=[];
        state.flexHistory=[];
        persistState();
        renderAll();
      });
    }

    /* ================= ALIMENTAÇÃO ================= */

    const baseFoodOptions = {
      cafe:{ label:"Café da manhã", icon:"☕",
        options:[
          {id:"cafe1",nome:"Tapioca com queijo",instrucao:"Tapioca na frigideira antiaderente com queijo branco/minas."},
          {id:"cafe2",nome:"Pão de frigideira de polvilho",instrucao:"Ovo + polvilho + queijo, dourar dos dois lados."},
          {id:"cafe3",nome:"Cuscuz com ovo ou queijo",instrucao:"Cuscuz no cuscuzeiro; servir com ovo mexido ou queijo."},
          {id:"cafe4",nome:"Iogurte natural + fruta",instrucao:"Iogurte sem açúcar com fruta picada."}
        ]
      },
      lancheManha:{ label:"Lanche da manhã", icon:"🥐",
        options:[
          {id:"lm1",nome:"Fruta fresca",instrucao:"Banana, maçã, tangerina..."},
          {id:"lm2",nome:"Oleaginosas",instrucao:"1 punhado de castanhas/nozes."},
          {id:"lm3",nome:"Iogurte natural",instrucao:"Preferir sem açúcar."}
        ]
      },
      almoco:{ label:"Almoço", icon:"🍛",
        options:[
          {id:"al1",nome:"Arroz + feijão + carne moída + salada + legumes",instrucao:"Prato colorido: 1/2 legumes, 1/4 arroz, 1/4 proteína."},
          {id:"al2",nome:"Legumes assados + frango + salada",instrucao:"Legumes ao forno + frango grelhado simples."},
          {id:"al3",nome:"Picanha suína + arroz + salada",instrucao:"Porção pequena, assada e com pouco óleo."}
        ]
      },
      lancheTarde:{ label:"Lanche da tarde", icon:"🍎",
        options:[
          {id:"lt1",nome:"Repetir café da manhã",instrucao:"Tapioca ou pão de polvilho, sem exagero."},
          {id:"lt2",nome:"Fruta + castanhas",instrucao:"Fibra + gordura boa pra segurar fome."},
          {id:"lt3",nome:"Iogurte + aveia/chia",instrucao:"Ajuda saciedade e digestão."}
        ]
      },
      jantar:{ label:"Jantar", icon:"🍽️",
        options:[
          {id:"ja1",nome:"Comida sem feijão",instrucao:"Arroz + proteína + legumes."},
          {id:"ja2",nome:"Sopa (Holy Soup)",instrucao:"Aquecer conforme instruções da embalagem."},
          {id:"ja3",nome:"Lanche leve (omelete ou sanduíche)",instrucao:"Evitar fritura pesada; preferir omelete com legumes."}
        ]
      },
      ceia:{ label:"Ceia", icon:"🌙",
        options:[
          {id:"ce1",nome:"Chá sem cafeína",instrucao:"Camomila, erva-doce, cidreira."},
          {id:"ce2",nome:"Fruta pequena ou 1/2 banana",instrucao:"Se estiver com fome antes de dormir."},
          {id:"ce3",nome:"Iogurte pequeno",instrucao:"Preferir versões menos açucaradas."}
        ]
      }
    };

    function ensureFoodOptionsState(){
      if(!state.foodOptionsState){
        state.foodOptionsState = JSON.parse(JSON.stringify(baseFoodOptions));
        persistState();
      }
      return state.foodOptionsState;
    }
    function getFoodDayState(day){
      if(!state.foodState[day]) state.foodState[day]={meals:{}};
      return state.foodState[day];
    }
    function getMealState(day,mealKey){
      const dayState=getFoodDayState(day);
      if(!dayState.meals[mealKey]){
        dayState.meals[mealKey]={ skip:false,notFollow:false,notFollowNote:"",options:{} };
      }
      return dayState.meals[mealKey];
    }

    function toggleMealSkip(day,mealKey){
      const m=getMealState(day,mealKey);
      m.skip=!m.skip;
      if(m.skip){
        m.notFollow=false;
        m.notFollowNote="";
        m.options={};
      }
      persistState(); renderFood();
    }
    function toggleMealNotFollow(day,mealKey){
      const m=getMealState(day,mealKey);
      m.notFollow=!m.notFollow;
      if(m.notFollow){
        m.skip=false;
        m.options={};
      }else{
        m.notFollowNote="";
      }
      persistState(); renderFood();
    }
    function setMealNotFollowNote(day,mealKey,note){
      const m=getMealState(day,mealKey);
      m.notFollowNote=note; persistState();
    }
    function toggleFoodOptionChecked(day,mealKey,optionId){
      const m=getMealState(day,mealKey);
      if(!m.options[optionId]) m.options[optionId]={checked:false,note:""};
      m.options[optionId].checked=!m.options[optionId].checked;
      if(!m.options[optionId].checked) m.options[optionId].note="";
      m.skip=false; m.notFollow=false; m.notFollowNote="";
      persistState(); renderFood();
    }
    function setFoodOptionNote(day,mealKey,optionId,note){
      const m=getMealState(day,mealKey);
      if(!m.options[optionId]) m.options[optionId]={checked:true,note:""};
      m.options[optionId].note=note; persistState();
    }
    function addFoodOption(mealKey,nome,instrucao){
      const optState=ensureFoodOptionsState();
      const meal=optState[mealKey]; if(!meal) return;
      const id=mealKey+"_custom_"+Date.now();
      meal.options.push({id,nome,instrucao});
      persistState(); renderFood();
    }
  function editFoodOption(mealKey, optionId) {
  const optionsState = ensureFoodOptionsState();
  const meal = optionsState[mealKey];
  if (!meal) return;
  const opt = meal.options.find((o) => o.id === optionId);
  if (!opt) return;

  openGenericEditModal({
    title: "Editar opção de refeição",
    initialName: opt.nome,
    initialInstr: opt.instrucao || "",
    onSave: (novoNome, novaInstr) => {
      opt.nome = novoNome.trim();
      opt.instrucao = (novaInstr || "").trim();
      persistState();
      renderFood();
    }
  });
}


    function deleteFoodOption(mealKey,optionId){
      const optState=ensureFoodOptionsState();
      const meal=optState[mealKey]; if(!meal) return;
      const idx=meal.options.findIndex(o=>o.id===optionId);
      if(idx===-1) return;
      if(!confirm("Deseja excluir essa opção?")) return;
      meal.options.splice(idx,1);
      Object.keys(state.foodState||{}).forEach(d=>{
        const dayState=state.foodState[d];
        if(!dayState || !dayState.meals) return;
        const m=dayState.meals[mealKey];
        if(m && m.options && m.options[optionId]) delete m.options[optionId];
      });
      persistState(); renderFood();
    }

    function renderFood(){
      const day=getSelectedDay();
      const ctx=getDayContext(day);
      const weekday=getWeekdayLabel(day);
      const ctxLabel = ctx==="casa"?"Casa":ctx==="pais"?"Casa dos pais":ctx==="viagem"?"Viagem":"Pausa";
      badgeFoodDia.textContent=`${weekday} • Dia ${day} • ${ctxLabel}`;

      const optState=ensureFoodOptionsState();
      foodContent.innerHTML="";

      if(ctx==="pausa"){
        foodContent.innerHTML='<div class="empty-message">Dia de pausa: sem plano rígido de alimentação. Se alimente como der, com gentileza. 💛</div>';
        foodStats.innerHTML="";
        return;
      }

      const mealOrder=["cafe","lancheManha","almoco","lancheTarde","jantar","ceia"];
      mealOrder.forEach(mealKey=>{
        const mealCfg=optState[mealKey]; if(!mealCfg) return;
        const mState=getMealState(day,mealKey);

        const card=document.createElement("div");
        card.className="meal-card";

        const header=document.createElement("div");
        header.className="meal-header";

        const title=document.createElement("div");
        title.className="meal-title";
        title.innerHTML=`<span>${mealCfg.icon}</span><span>${mealCfg.label}</span>`;

        const actions=document.createElement("div");
        actions.className="meal-header-actions";

        const btnSkip=document.createElement("button");
        btnSkip.type="button";
        btnSkip.className="meal-toggle-btn";
        btnSkip.textContent="Pular";
        if(mState.skip) btnSkip.classList.add("skip-active");
        btnSkip.onclick=()=>toggleMealSkip(day,mealKey);

        const btnOff=document.createElement("button");
        btnOff.type="button";
        btnOff.className="meal-toggle-btn";
        btnOff.textContent="Não segui";
        if(mState.notFollow) btnOff.classList.add("off-active");
        btnOff.onclick=()=>toggleMealNotFollow(day,mealKey);

        actions.appendChild(btnSkip);
        actions.appendChild(btnOff);
        header.appendChild(title);
        header.appendChild(actions);
        card.appendChild(header);

        if(mState.notFollow){
          const block=document.createElement("div");
          block.className="meal-note-block";
          const ta=document.createElement("textarea");
          ta.className="meal-note";
          ta.placeholder="Motivo (ifood, amigos, aniversário, etc.)";
          ta.value=mState.notFollowNote||"";
          ta.oninput=()=>setMealNotFollowNote(day,mealKey,ta.value);
          block.appendChild(ta);
          card.appendChild(block);
        }

        if(!mState.skip && !mState.notFollow){
          const listDiv=document.createElement("div");
          listDiv.className="meal-options-list";

          (mealCfg.options||[]).forEach(opt=>{
            const oState=mState.options[opt.id]||{checked:false,note:""};

            const row=document.createElement("div");
            row.className="meal-option-row";

            const cb=document.createElement("input");
            cb.type="checkbox";
            cb.checked=!!oState.checked;
            cb.onchange=()=>toggleFoodOptionChecked(day,mealKey,opt.id);

            const main=document.createElement("div");
            main.className="meal-option-main";
            const nameSpan=document.createElement("span");
            nameSpan.textContent=opt.nome;
            main.appendChild(nameSpan);

            const btns=document.createElement("div");
            btns.className="meal-option-buttons";

            const btnAdjust=document.createElement("button");
            btnAdjust.type="button";
            btnAdjust.className="meal-adjust-btn";
            btnAdjust.textContent="Ajuste/Obs";
            btnAdjust.style.display=oState.checked?"inline-flex":"none";

            const hasInstr=!!(opt.instrucao && opt.instrucao.trim()!=="");
            const btnRecipe=document.createElement("button");
            btnRecipe.type="button";
            btnRecipe.className="btn-icon";
            btnRecipe.textContent="+";
            btnRecipe.title="Ver receita";

            const btnEdit=document.createElement("button");
            btnEdit.type="button";
            btnEdit.className="btn-icon";
            btnEdit.textContent="✎";
            btnEdit.title="Editar";
            btnEdit.onclick=()=>editFoodOption(mealKey,opt.id);

            const btnDel=document.createElement("button");
            btnDel.type="button";
            btnDel.className="btn-icon";
            btnDel.textContent="🗑";
            btnDel.title="Excluir";
            btnDel.onclick=()=>deleteFoodOption(mealKey,opt.id);

            btns.appendChild(btnAdjust);
            if(hasInstr) btns.appendChild(btnRecipe);
            btns.appendChild(btnEdit);
            btns.appendChild(btnDel);

            row.appendChild(cb);
            row.appendChild(main);
            row.appendChild(btns);

            const noteBlock=document.createElement("div");
            noteBlock.className="meal-note-block";
            const noteArea=document.createElement("textarea");
            noteArea.className="meal-note";
            noteArea.placeholder="Descreva o ajuste (troquei proteína, comi sobremesa, etc.)";
            noteArea.value=oState.note||"";
            noteArea.oninput=()=>setFoodOptionNote(day,mealKey,opt.id,noteArea.value);
            noteBlock.appendChild(noteArea);
            noteBlock.style.display=(oState.checked && oState.note)?"block":"none";

            const recipeBlock=document.createElement("div");
            recipeBlock.className="meal-recipe";
            recipeBlock.textContent=opt.instrucao||"";

            btnAdjust.onclick=()=>{
              const vis=noteBlock.style.display==="block";
              noteBlock.style.display=vis?"none":"block";
            };
            if(hasInstr){
              btnRecipe.onclick=()=>{
                const vis=recipeBlock.style.display==="block";
                recipeBlock.style.display=vis?"none":"block";
                btnRecipe.textContent=vis?"+":"−";
              };
            }

            listDiv.appendChild(row);
            listDiv.appendChild(noteBlock);
            if(hasInstr) listDiv.appendChild(recipeBlock);
          });

          card.appendChild(listDiv);
        }

        foodContent.appendChild(card);
      });

      // Área única de adicionar opção
      const addArea=document.createElement("div");
      addArea.className="meal-add-area";
      const btnToggle=document.createElement("button");
      btnToggle.type="button";
      btnToggle.textContent="➕ Adicionar opção";
      const formDiv=document.createElement("div");
      formDiv.style.display="none";

      const lbl=document.createElement("label");
      lbl.textContent="Nova opção de refeição:";
      const selectMeal=document.createElement("select");
      [
        {key:"cafe",label:"Café da manhã"},
        {key:"lancheManha",label:"Lanche da manhã"},
        {key:"almoco",label:"Almoço"},
        {key:"lancheTarde",label:"Lanche da tarde"},
        {key:"jantar",label:"Jantar"},
        {key:"ceia",label:"Ceia"}
      ].forEach(m=>{
        if(!optState[m.key]) return;
        const o=document.createElement("option");
        o.value=m.key; o.textContent=m.label;
        selectMeal.appendChild(o);
      });
      const inputNome=document.createElement("input");
      inputNome.type="text";
      inputNome.placeholder="Nome da preparação";
      const textareaInstr=document.createElement("textarea");
      textareaInstr.placeholder="Instruções/receita (opcional)";
      const btnAdd=document.createElement("button");
      btnAdd.type="button";
      btnAdd.textContent="Salvar opção";

      btnToggle.onclick=()=>{
        const vis=formDiv.style.display==="block";
        formDiv.style.display=vis?"none":"block";
      };
      btnAdd.onclick=()=>{
        const nome=inputNome.value.trim();
        const instr=textareaInstr.value.trim();
        if(!nome){ alert("Digite o nome da opção."); return; }
        addFoodOption(selectMeal.value,nome,instr);
        inputNome.value=""; textareaInstr.value="";
      };

      formDiv.appendChild(lbl);
      formDiv.appendChild(selectMeal);
      formDiv.appendChild(inputNome);
      formDiv.appendChild(textareaInstr);
      formDiv.appendChild(btnAdd);
      addArea.appendChild(btnToggle);
      addArea.appendChild(formDiv);
      foodContent.appendChild(addArea);

      renderFoodStats();
    }

    function renderFoodStats(){
      const day=getSelectedDay();
      const optState=ensureFoodOptionsState();
      const mealOrder=["cafe","lancheManha","almoco","lancheTarde","jantar","ceia"];
      let dentro=0,pulado=0,naoCumpri=0,total=0;

      mealOrder.forEach(mealKey=>{
        const cfg=optState[mealKey]; if(!cfg) return;
        const m=getMealState(day,mealKey);

        if(m.skip){ pulado++; total++; return; }
        if(m.notFollow){ naoCumpri++; total++; return; }

        const vals=Object.values(m.options||{});
        const anyChecked=vals.some(v=>v.checked);
        if(!anyChecked) return;
        dentro++; total++;
      });

      const pDentro=total?Math.round(dentro/total*100):0;
      const pPul=total?Math.round(pulado/total*100):0;
      const pNao=total?Math.round(naoCumpri/total*100):0;

      badgeFoodResumo.textContent =
        total===0 ? "Nenhuma refeição registrada ainda"
                  : `${dentro} dentro • ${pulado} puladas • ${naoCumpri} fora`;

      foodStats.innerHTML="";
      const row=document.createElement("div");
      row.className="stats-row";
      row.innerHTML=`
        <span class="stats-chip">Dentro do combinado: ${pDentro}%</span>
        <span class="stats-chip">Puladas: ${pPul}%</span>
        <span class="stats-chip">Não segui: ${pNao}%</span>
      `;
      foodStats.appendChild(row);

      const bars=document.createElement("div");
      bars.className="bar-group";
      bars.innerHTML=`
        <div>
          <div class="bar-label">Dentro do combinado</div>
          <div class="bar"><div class="bar-fill" style="width:${pDentro}%;"></div></div>
        </div>
        <div>
          <div class="bar-label">Refeições puladas</div>
          <div class="bar"><div class="bar-fill" style="width:${pPul}%;"></div></div>
        </div>
        <div>
          <div class="bar-label">Não segui o combinado</div>
          <div class="bar"><div class="bar-fill" style="width:${pNao}%;"></div></div>
        </div>
      `;
      foodStats.appendChild(bars);

      const mini=document.createElement("div");
      mini.className="mini-text";
      mini.textContent="Use o resumo para enxergar padrões, não para se culpar. Alguns dias vão sair do combinado, e tudo bem. 💙";
      foodStats.appendChild(mini);

      // panorama ciclo
      let bons=0,parciais=0,dificeis=0,semReg=0;
      for(let d=1;d<=14;d++){
        let dDentro=0,dPul=0,dNao=0,dTot=0;
        mealOrder.forEach(mealKey=>{
          const cfg=optState[mealKey]; if(!cfg) return;
          const m=getMealState(d,mealKey);
          if(m.skip){dPul++;dTot++;return;}
          if(m.notFollow){dNao++;dTot++;return;}
          const vals=Object.values(m.options||{});
          const any=vals.some(v=>v.checked);
          if(!any) return;
          dDentro++;dTot++;
        });
        if(dTot===0){semReg++;continue;}
        const ratio=dDentro/dTot;
        if(ratio>=0.7) bons++;
        else if(ratio>=0.4) parciais++;
        else dificeis++;
      }

      const cardCiclo=document.createElement("div");
      cardCiclo.className="mt-4";
      const titulo=document.createElement("div");
      titulo.className="section-title";
      titulo.innerHTML='<span class="icon">📆</span><span>Panorama do ciclo (14 dias)</span>';
      cardCiclo.appendChild(titulo);
      const linha=document.createElement("div");
      linha.className="stats-row";
      linha.innerHTML=`
        <span class="stats-chip">Bem alinhados (≥ 70% dentro): ${bons}</span>
        <span class="stats-chip">Mistos (40–69%): ${parciais}</span>
        <span class="stats-chip">Difíceis (&lt; 40%): ${dificeis}</span>
        <span class="stats-chip">Sem registro: ${semReg}</span>
      `;
      cardCiclo.appendChild(linha);
      const mini2=document.createElement("div");
      mini2.className="mini-text";
      mini2.textContent="É uma visão gentil do ciclo inteiro, para você enxergar tendências.";
      cardCiclo.appendChild(mini2);

      const btnDownload=document.createElement("button");
      btnDownload.type="button";
      btnDownload.className="btn-small";
      btnDownload.style.marginTop="0.5rem";
      btnDownload.textContent="⬇️ Baixar resumo da alimentação (14 dias)";
      btnDownload.onclick=downloadFoodCycleSummary;
      cardCiclo.appendChild(btnDownload);

      foodStats.appendChild(cardCiclo);
    }

    function downloadFoodCycleSummary(){
      const optState=ensureFoodOptionsState();
      const mealOrder=["cafe","lancheManha","almoco","lancheTarde","jantar","ceia"];
      const lines=[];
      const now=new Date();
      lines.push("Resumo da alimentação – ciclo 14 dias");
      lines.push(`Gerado em: ${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR")}`);
      lines.push("");
      let bons=0,parciais=0,dificeis=0,semReg=0;

      for(let d=1;d<=14;d++){
        let dentro=0,pulado=0,nao=0,total=0;
        mealOrder.forEach(mealKey=>{
          const cfg=optState[mealKey]; if(!cfg) return;
          const m=getMealState(d,mealKey);
          if(m.skip){pulado++;total++;return;}
          if(m.notFollow){nao++;total++;return;}
          const vals=Object.values(m.options||{});
          const any=vals.some(v=>v.checked);
          if(!any) return;
          dentro++;total++;
        });
        let perc=total?Math.round(dentro/total*100):0;
        let classe;
        if(total===0){classe="sem registro";semReg++;}
        else if(perc>=70){classe="bem alinhado";bons++;}
        else if(perc>=40){classe="misto";parciais++;}
        else{classe="difícil";dificeis++;}
        lines.push(`Dia ${d}: ${dentro} dentro, ${pulado} puladas, ${nao} fora (${perc}% dentro) → ${classe}`);
      }
      lines.push("");
      lines.push("Panorama do ciclo:");
      lines.push(`Bem alinhados: ${bons}`);
      lines.push(`Mistos: ${parciais}`);
      lines.push(`Difíceis: ${dificeis}`);
      lines.push(`Sem registro: ${semReg}`);

      const blob=new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url; a.download="resumo_alimentacao_14_dias.txt";
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    }
    function computeCycleFoodStats(foodStateSnapshot) {
  const optionsState = ensureFoodOptionsState();
  const mealOrder = ["cafe", "lancheManha", "almoco", "lancheTarde", "jantar", "ceia"];

  let dentro = 0;
  let pulado = 0;
  let naoCumpri = 0;
  let total = 0;

  for (let d = 1; d <= 14; d++) {
    const dayMeals = foodStateSnapshot[d] || foodStateSnapshot[String(d)];
    if (!dayMeals || !dayMeals.meals) continue;

    mealOrder.forEach((mealKey) => {
      const cfg = optionsState[mealKey];
      if (!cfg) return;
      const mealState = dayMeals.meals[mealKey];
      if (!mealState) return;

      if (mealState.skip) {
        pulado++;
        total++;
        return;
      }
      if (mealState.notFollow) {
        naoCumpri++;
        total++;
        return;
      }

      const opts = mealState.options || {};
      const anyChecked = Object.values(opts).some((v) => v.checked);
      if (!anyChecked) return;

      dentro++;
      total++;
    });
  }

  const percDentro = total ? Math.round((dentro / total) * 100) : 0;
  const percPulado = total ? Math.round((pulado / total) * 100) : 0;
  const percNao = total ? Math.round((naoCumpri / total) * 100) : 0;

  return {
    dentro,
    pulado,
    naoCumpri,
    total,
    percDentro,
    percPulado,
    percNao
  };
}

function computeCycleExerciseStats(exDoneSnapshot) {
  let diasComMov = 0;
  const totalDias = 14;

  for (let d = 1; d <= 14; d++) {
    const dayEx = exDoneSnapshot[d] || exDoneSnapshot[String(d)];
    if (!dayEx) continue;
    const anyDone = Object.values(dayEx).some((v) => !!v);
    if (anyDone) diasComMov++;
  }

  const percDiasMov = totalDias ? Math.round((diasComMov / totalDias) * 100) : 0;

  return {
    diasComMov,
    totalDias,
    percDiasMov
  };
}


    /* ================= EXERCÍCIOS ================= */

    // base: só Dia 1 completo por enquanto; outros dias podem repetir esse padrão
    const baseExOptions = {
      1: [
        // Casa / alta
        {id:"d1_est_alta",nome:"Esteira 10–15 min",instrucao:"Comece devagar 2–3 min, ajuste conforme energia. Se cansar, reduza tempo.",equipamento:"Esteira",energia:"alta",contexto:"casa",categoria:"cardio"},
        {id:"d1_ponte_alta",nome:"Ponte 2x10–12 rep",instrucao:"Deitada, joelhos dobrados, elevar quadril alinhando joelhos e ombros.",equipamento:"Tapete",energia:"alta",contexto:"casa",categoria:"forca"},
        {id:"d1_agach_bola",nome:"Agachamento com bola 2x8–10",instrucao:"Bola nas costas na parede, descer devagar sem forçar joelhos.",equipamento:"Bola",energia:"alta",contexto:"casa",categoria:"forca"},
        {id:"d1_step_up",nome:"Step-up 1–2 min",instrucao:"Subir e descer o degrau com apoio, alternando pernas.",equipamento:"Step",energia:"alta",contexto:"casa",categoria:"forca"},
        // Casa / baixa
        {id:"d1_resp_baixa",nome:"Respiração profunda 2 min",instrucao:"Inspira 4s, segura 2s, solta 6s pela boca.",equipamento:"Sem equipamento",energia:"baixa",contexto:"casa",categoria:"respiracao"},
        {id:"d1_ponte_leve",nome:"Ponte simples 1x6–8",instrucao:"Elevar quadril só um pouco, sem forçar lombar.",equipamento:"Tapete",energia:"baixa",contexto:"casa",categoria:"forca"},
        // Casa dos pais
        {id:"d1_pais_caminhada",nome:"Caminhada leve 10–20 min",instrucao:"Ritmo confortável, podendo conversar.",equipamento:"Sem equipamento",energia:"alta",contexto:"pais",categoria:"cardio"},
        {id:"d1_pais_along_sem",nome:"Alongamento em pé",instrucao:"Alongar pescoço, ombros, pernas, sem equipamento.",equipamento:"Sem equipamento",energia:"alta",contexto:"pais",categoria:"mobilidade"},
        {id:"d1_pais_resp",nome:"Respiração + alongamento sentado",instrucao:"Respiração profunda e alongamentos leves sentado.",equipamento:"Sem equipamento",energia:"baixa",contexto:"pais",categoria:"respiracao"},
        // Viagem
        {id:"d1_viagem_resp",nome:"Respiração na cama",instrucao:"Deitada, respiração diafragmática por 3–5 min.",equipamento:"Sem equipamento",energia:"baixa",contexto:"viagem",categoria:"respiracao"},
        {id:"d1_viagem_along_cama",nome:"Alongamento na cama",instrucao:"Esticar pernas e braços, movimentos suaves.",equipamento:"Sem equipamento",energia:"baixa",contexto:"viagem",categoria:"mobilidade"},
        // Pausa
        {id:"d1_pausa_resp",nome:"Respiração curta",instrucao:"Só se quiser: 2–3 min de respiração calma.",equipamento:"Sem equipamento",energia:"baixa",contexto:"pausa",categoria:"respiracao"},
        {id:"d1_pausa_along",nome:"Alongamento leve sentado",instrucao:"Movimentos suaves de pescoço e ombros.",equipamento:"Sem equipamento",energia:"baixa",contexto:"pausa",categoria:"mobilidade"}
      ]
    };

    function ensureExOptionsState(){
      if(!state.exOptionsState){
        // copia base para todos os dias, por enquanto
        state.exOptionsState={};
        for(let d=1;d<=14;d++){
          state.exOptionsState[d]= JSON.parse(JSON.stringify(baseExOptions[1]||[]));
        }
        persistState();
      }
      return state.exOptionsState;
    }
    function getExDayList(day){
      const st=ensureExOptionsState();
      if(!st[day]) st[day]=[];
      return st[day];
    }
    function getExDayState(day){
      if(!state.exState[day]) state.exState[day]={};
      return state.exState[day];
    }
    function toggleExerciseDone(day,exId){
      const dState=getExDayState(day);
      dState[exId]=!dState[exId];
      persistState(); renderExercises(); renderExerciseStats();
    }

    function addExerciseToDay(day,contexto,energia,nome,instrucao,equipamento,categoria){
      const exList=getExDayList(day);
      const id="ex_custom_"+Date.now();
      exList.push({id,nome,instrucao,equipamento,energia,contexto,categoria});
      persistState(); renderExercises();
    }
    
    function editExercise(day, exId) {
  const exList = getExDayList(day);  // pega a lista de exercícios daquele dia
  const ex = exList.find((e) => e.id === exId);
  if (!ex) return;

  openGenericEditModal({
    title: "Editar exercício",
    initialName: ex.nome,
    initialInstr: ex.instrucao || "",
    onSave: (novoNome, novaInstr) => {
      ex.nome = novoNome.trim();
      ex.instrucao = (novaInstr || "").trim();
      persistState();
      renderExercises();
    }
  });
}



    
    function deleteExercise(day,exId){
      const exList=getExDayList(day);
      const idx=exList.findIndex(e=>e.id===exId); if(idx===-1) return;
      if(!confirm("Excluir este exercício?")) return;
      exList.splice(idx,1);
      const dState=getExDayState(day);
      if(dState[exId]!=null) delete dState[exId];
      persistState(); renderExercises(); renderExerciseStats();
    }

    function renderExercises(){
      const day=getSelectedDay();
      const ctx=getDayContext(day);
      const energy=getDayEnergy(day);
      const weekday=getWeekdayLabel(day);
      badgeExDia.textContent=`${weekday} • Dia ${day}`;
      const ctxLabel=ctx==="casa"?"Casa":ctx==="pais"?"Casa dos pais":ctx==="viagem"?"Viagem":"Pausa";
      exContextLabel.textContent=`Contexto: ${ctxLabel} • Energia: ${energy==="alta"?"versão completa":"versão leve"}`;

      exerciseContent.innerHTML="";
      const exList=getExDayList(day);
      const dState=getExDayState(day);

      // filtrar por contexto+energia
      let filtered=exList.filter(e=>e.contexto===ctx && e.energia===energy);
      // se for pausa, é tudo opcional
      if(ctx==="pausa" && filtered.length===0){
        exerciseContent.innerHTML='<div class="empty-message">Dia de pausa: nenhum exercício obrigatório. Respiração e alongamento contam como cuidado, não como cobrança. 💙</div>';
      }

      if(filtered.length){
        // agrupar por equipamento com ordem especial: Esteira, Sem equipamento, outros
        const grupos={};
        filtered.forEach(ex=>{
          const eq=ex.equipamento||"Sem equipamento";
          if(!grupos[eq]) grupos[eq]=[];
          grupos[eq].push(ex);
        });
        const ordemEquip=["Esteira","Sem equipamento"];
        const outros=Object.keys(grupos).filter(k=>!ordemEquip.includes(k)).sort();
        const ordem=[...ordemEquip,...outros.filter(k=>grupos[k])];

        ordem.forEach(eq=>{
          if(!grupos[eq]) return;
          const bloco=document.createElement("div");
          bloco.className="exercise-block";
          const title=document.createElement("div");
          title.className="exercise-title";
          title.innerHTML=`<span>🏋️‍♀️</span><span>${eq}</span>`;
          bloco.appendChild(title);

          const list=document.createElement("ul");
          list.className="exercise-list";
          grupos[eq].forEach(ex=>{
            const li=document.createElement("li");
            li.className="exercise-item";
            const cb=document.createElement("input");
            cb.type="checkbox";
            cb.checked=!!dState[ex.id];
            cb.onchange=()=>toggleExerciseDone(day,ex.id);

            const label=document.createElement("label");
            label.textContent=ex.nome;

            const btns=document.createElement("div");
            btns.className="meal-option-buttons";

            const btnPlus=document.createElement("button");
            btnPlus.type="button";
            btnPlus.className="btn-icon";
            btnPlus.textContent="+";
            btnPlus.title="Ver instruções";

            const btnEdit=document.createElement("button");
            btnEdit.type="button";
            btnEdit.className="btn-icon";
            btnEdit.textContent="✎";
            btnEdit.title="Editar";
            btnEdit.onclick=()=>editExercise(day,ex.id);

            const btnDel=document.createElement("button");
            btnDel.type="button";
            btnDel.className="btn-icon";
            btnDel.textContent="🗑";
            btnDel.title="Excluir";
            btnDel.onclick=()=>deleteExercise(day,ex.id);

            btns.appendChild(btnPlus);
            btns.appendChild(btnEdit);
            btns.appendChild(btnDel);

            const note=document.createElement("div");
            note.className="exercise-note";
            note.textContent=ex.instrucao||"";
            btnPlus.onclick=()=>{
              const vis=note.style.display==="block";
              note.style.display=vis?"none":"block";
              btnPlus.textContent=vis?"+":"−";
            };

            li.appendChild(cb);
            li.appendChild(label);
            li.appendChild(btns);
            list.appendChild(li);
            list.appendChild(note);
          });
          bloco.appendChild(list);
          exerciseContent.appendChild(bloco);
        });
      }

      // área adicionar exercício
      const addArea=document.createElement("div");
      addArea.className="meal-add-area";
      const btnToggle=document.createElement("button");
      btnToggle.type="button";
      btnToggle.textContent="➕ Adicionar exercício";
      const formDiv=document.createElement("div");
      formDiv.style.display="none";

      const lbl=document.createElement("label");
      lbl.textContent="Novo exercício para o dia/contexto selecionados:";
      const inpNome=document.createElement("input");
      inpNome.type="text"; inpNome.placeholder="Nome do exercício";
      const inpInstr=document.createElement("textarea");
      inpInstr.placeholder="Instruções (opcional)";
      const inpEquip=document.createElement("input");
      inpEquip.type="text"; inpEquip.placeholder="Equipamento (ex.: Esteira, Bola...)";
      const selEner=document.createElement("select");
      ["alta","baixa"].forEach(v=>{
        const o=document.createElement("option");
        o.value=v; o.textContent=v==="alta"?"Energia alta (completa)":"Energia baixa (leve)";
        selEner.appendChild(o);
      });
      selEner.value=getDayEnergy(day);

      const selCtx=document.createElement("select");
      [
        {v:"casa",t:"Casa"},
        {v:"pais",t:"Casa dos pais"},
        {v:"viagem",t:"Viagem"},
        {v:"pausa",t:"Pausa"}
      ].forEach(c=>{
        const o=document.createElement("option");
        o.value=c.v; o.textContent=c.t;
        selCtx.appendChild(o);
      });
      selCtx.value=getDayContext(day);

      const inpCat=document.createElement("input");
      inpCat.type="text";
      inpCat.placeholder="Categoria (força, mobilidade, cardio, respiração...)";

      const btnAdd=document.createElement("button");
      btnAdd.type="button";
      btnAdd.textContent="Salvar exercício";

      btnToggle.onclick=()=>{
        const vis=formDiv.style.display==="block";
        formDiv.style.display=vis?"none":"block";
      };
      btnAdd.onclick=()=>{
        const nome=inpNome.value.trim();
        if(!nome){ alert("Digite o nome do exercício."); return; }
        addExerciseToDay(day,selCtx.value,selEner.value,nome,inpInstr.value.trim(),inpEquip.value.trim()||"Sem equipamento",inpCat.value.trim()||"outros");
        inpNome.value=""; inpInstr.value=""; inpEquip.value=""; inpCat.value="";
      };

      formDiv.appendChild(lbl);
      formDiv.appendChild(inpNome);
      formDiv.appendChild(inpInstr);
      formDiv.appendChild(inpEquip);
      formDiv.appendChild(selEner);
      formDiv.appendChild(selCtx);
      formDiv.appendChild(inpCat);
      formDiv.appendChild(btnAdd);

      addArea.appendChild(btnToggle);
      addArea.appendChild(formDiv);
      exerciseContent.appendChild(addArea);

      renderExerciseStats();
    }

    function renderExerciseStats(){
      const exState=state.exState||{};
      const exOptions=ensureExOptionsState();
      let diasMov=0, diasSem=0, versaoAlta=0, versaoBaixa=0;
      let totalSessoes=0;
      let catCount={forca:0,mobilidade:0,cardio:0,respiracao:0,outros:0};
      let maxStreak=0,curStreak=0;

      for(let d=1;d<=14;d++){
        const dState=exState[d]||{};
        const options=exOptions[d]||[];
        const doneIds=Object.keys(dState).filter(k=>dState[k]);
        const hasMov=doneIds.length>0;
        if(hasMov){
          diasMov++; curStreak=0;
          const energia=getDayEnergy(d);
          if(energia==="alta") versaoAlta++; else versaoBaixa++;
          totalSessoes+=doneIds.length;
          doneIds.forEach(id=>{
            const ex=options.find(e=>e.id===id);
            const cat=(ex&&ex.categoria)||"outros";
            if(catCount[cat]==null) catCount[cat]=0;
            catCount[cat]++;
          });
        }else{
          diasSem++;
          curStreak++;
          if(curStreak>maxStreak) maxStreak=curStreak;
        }
      }

      badgeExResumo.textContent=`Dias com movimento: ${diasMov} • Sem exercício: ${diasSem}`;

      exerciseStats.innerHTML="";
      const row=document.createElement("div");
      row.className="stats-row";
      row.innerHTML=`
        <span class="stats-chip">Dias com movimento: ${diasMov}</span>
        <span class="stats-chip">Maior sequência sem exercício: ${maxStreak} dia(s)</span>
        <span class="stats-chip">Versão completa (alta energia): ${versaoAlta}</span>
        <span class="stats-chip">Versão leve (baixa energia): ${versaoBaixa}</span>
        <span class="stats-chip">Total de sessões: ${totalSessoes}</span>
      `;
      exerciseStats.appendChild(row);

      const cats=document.createElement("div");
      cats.className="stats-row";
      cats.innerHTML=`
        <span class="stats-chip">Força/estabilidade: ${catCount.forca||0}</span>
        <span class="stats-chip">Mobilidade/alongamento: ${catCount.mobilidade||0}</span>
        <span class="stats-chip">Cardio leve: ${catCount.cardio||0}</span>
        <span class="stats-chip">Respiração/relaxamento: ${catCount.respiracao||0}</span>
      `;
      exerciseStats.appendChild(cats);

      const mini=document.createElement("div");
      mini.className="mini-text";
      mini.textContent="Qualquer movimento conta. A ideia é somar pequenos cuidados ao longo do ciclo, respeitando sua energia.";
      exerciseStats.appendChild(mini);
    }

    function downloadExerciseSummary(){
      const exState=state.exState||{};
      const exOptions=ensureExOptionsState();
      const lines=[];
      const now=new Date();
      lines.push("Resumo de exercícios – ciclo 14 dias");
      lines.push(`Gerado em: ${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR")}`);
      lines.push("");

      for(let d=1;d<=14;d++){
        const dState=exState[d]||{};
        const options=exOptions[d]||[];
        const doneIds=Object.keys(dState).filter(k=>dState[k]);
        if(doneIds.length===0){
          lines.push(`Dia ${d}: nenhum exercício registrado.`);
        }else{
          lines.push(`Dia ${d}:`);
          doneIds.forEach(id=>{
            const ex=options.find(e=>e.id===id);
            const nome=ex?ex.nome:id;
            const ctx=ex?ex.contexto:"";
            const energia=ex?ex.energia:"";
            lines.push(`  - ${nome} [${ctx}, ${energia}]`);
          });
        }
      }
      const blob=new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"});
      const url=URL.createObjectURL(blob);
      const a=document.createElement("a");
      a.href=url; a.download="resumo_exercicios_14_dias.txt";
      document.body.appendChild(a); a.click();
      document.body.removeChild(a); URL.revokeObjectURL(url);
    }
    if(btnDownloadExResumo){
      btnDownloadExResumo.addEventListener("click",downloadExerciseSummary);
    }

    /* ================= CASA ================= */

    const domesticRoutine = {
      1:{
        indispensavel:[
          {id:"d1_louca",label:"Esvaziar máquina de louça",instrucao:"Guardar louça limpa e verificar se há algo para completar ciclo."},
          {id:"d1_regar",label:"Regar Maranta e Antúrio (se secos)",instrucao:"Verificar umidade com o dedo; não encharcar."}
        ],
        desejavel:[
          {id:"d1_mercado",label:"Mercado (despensa)",instrucao:"Checar básicos (arroz, feijão, café, ovos...)."}
        ]
      }
    };
    const parentsDomesticTasks={
      indispensavel:[
        {id:"pais_cama",label:"Forrar cama",instrucao:"Arrumar a cama que você usou."}
      ],
      desejavel:[
        {id:"pais_lixo",label:"Tirar lixo do quarto/banheiro",instrucao:"Recolher lixo que você usou."},
        {id:"pais_varrer",label:"Varrer quarto/banheiro",instrucao:"Passar vassoura rápida."}
      ]
    };

    function ensureDomesticCustom(day,ctx){
      if(!state.domesticCustom[day]) state.domesticCustom[day]={};
      if(!state.domesticCustom[day][ctx]) state.domesticCustom[day][ctx]={indispensavel:[],desejavel:[]};
      return state.domesticCustom[day][ctx];
    }
    function ensureObj(obj,key){ if(!obj[key]) obj[key]={}; return obj[key]; }
    // --- Editar / excluir tarefas domésticas personalizadas ---
function isCustomDomesticTask(taskId){
  // Tarefas personalizadas sempre começam com dom_custom_
  return taskId.startsWith("dom_custom_");
}

/* EDITAR QUALQUER TAREFA (fixa ou personalizada) */
function editDomesticTask(day, ctx, tipo, taskId) {
  const customCfg = ensureDomesticCustom(day, ctx);

  let lista = customCfg[tipo] || [];
  let task = lista.find(t => t.id === taskId);

    // Se é tarefa fixa, promover para custom
  if (!task) {
    // 🔹 NOVO: pegar a lista base certa dependendo do contexto
    let baseList = [];
    if (ctx === "pais") {
      // Tarefas da casa dos pais
      baseList = (parentsDomesticTasks[tipo] || []);
    } else {
      // Rotina normal de casa (dia 1, 2, etc.)
      const cfg = getDomesticDayConfig(day);
      baseList = cfg[tipo] || [];
    }

    const original = baseList.find(t => t.id === taskId);
    if (!original) return;

    task = {
      id: "dom_custom_" + ctx + "_" + Date.now(),
      label: original.label,
      instrucao: original.instrucao || ""
    };

    lista.push(task);

    // atualiza estados associados à tarefa antiga
    const replaceStateKeys = ["domesticDone", "domesticIgnored", "domesticReagendado"];
    replaceStateKeys.forEach(key => {
      if (state[key][day] && state[key][day][taskId]) {
        delete state[key][day][taskId];
        state[key][day][task.id] = true;
      }
    });

    state.flexList = state.flexList.map(t => {
      if (t.id === taskId) return { ...t, id: task.id };
      return t;
    });
  }


  /* Abrir modal preenchido */
  currentEdit = { day, ctx, tipo, task };
  editTaskName.value = task.label;
  editTaskInstr.value = task.instrucao || "";
  editTaskTipo.value = tipo;

  editTaskModal.style.display = "flex";
}

editTaskCancelBtn.addEventListener("click", () => {
  editTaskModal.style.display = "none";
  currentEdit = null;
});

editTaskSaveBtn.addEventListener("click", () => {
  if (!currentEdit) return;

  const { day, ctx, tipo, task } = currentEdit;

  task.label = editTaskName.value.trim();
  task.instrucao = editTaskInstr.value.trim();

  const newTipo = editTaskTipo.value;

  // Se mudou de categoria, mover de lista
  if (newTipo !== tipo) {
    const customCfg = ensureDomesticCustom(day, ctx);
    customCfg[tipo] = customCfg[tipo].filter(t => t.id !== task.id);
    customCfg[newTipo].push(task);
  }

  persistState();
  editTaskModal.style.display = "none";
  currentEdit = null;
  renderCasa();
  renderCasaStats();
 
});


/* EXCLUIR TAREFA CUSTOMIZADA */
function deleteDomesticTask(day, ctx, tipo, taskId){
  const isCustom = isCustomDomesticTask(taskId);

  const msg = isCustom
    ? "Excluir esta tarefa personalizada?"
    : `Excluir esta tarefa fixa deste dia?\n(Ela não aparecerá mais no Dia ${day} deste ciclo.)`;

  if (!confirm(msg)) return;

  if (isCustom) {
    // Remove da lista personalizada
    const customCfg = ensureDomesticCustom(day, ctx);
    const lista = customCfg[tipo] || [];
    const idx = lista.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      lista.splice(idx, 1);
    }
  } else {
    // Marca como "apagada" para este dia
    if (!state.domesticDeleted[day]) state.domesticDeleted[day] = {};
    state.domesticDeleted[day][taskId] = true;
  }

  // Limpa estados associados
  if (state.domesticDone[day]) delete state.domesticDone[day][taskId];
  if (state.domesticIgnored[day]) delete state.domesticIgnored[day][taskId];
  if (state.domesticReagendado[day]) delete state.domesticReagendado[day][taskId];

  state.flexList = state.flexList.filter(t => t.id !== taskId);
  state.flexHistory = (state.flexHistory || []).filter(t => t.id !== taskId);

  persistState();
  renderCasa();
  renderCasaStats();
}



    function getDomesticDayConfig(day){
      return domesticRoutine[day] || domesticRoutine[1] || {indispensavel:[],desejavel:[]};
    }
    function filterDomesticByContext(day,ctx,config){
      const baseInd=[...(config.indispensavel||[])];
      const baseDes=[...(config.desejavel||[])];
      const custom=state.domesticCustom[day] && state.domesticCustom[day][ctx] ?
        state.domesticCustom[day][ctx] : {indispensavel:[],desejavel:[]};

      if(ctx==="casa"){
        return {indispensavel:[...baseInd,...custom.indispensavel],desejavel:[...baseDes,...custom.desejavel]};
      }
      if(ctx==="pais"){
        return {
          indispensavel:[...(parentsDomesticTasks.indispensavel||[]),...(custom.indispensavel||[])],
          desejavel:[...(parentsDomesticTasks.desejavel||[]),...(custom.desejavel||[])]
        };
      }
      if(ctx==="viagem"||ctx==="pausa"){
        return {indispensavel:[...(custom.indispensavel||[])],desejavel:[...(custom.desejavel||[])]};
      }
      return {indispensavel:[...baseInd,...custom.indispensavel],desejavel:[...baseDes,...custom.desejavel]};
    }

    function toggleDomesticDone(day,taskId){
      const dayDone=ensureObj(state.domesticDone,day);
      dayDone[taskId]=!dayDone[taskId];
      // se estiver na flexList, remove
      state.flexList = state.flexList.filter(t=>t.id!==taskId);
      persistState(); renderCasa(); renderCasaStats();
    }
    function markDomesticIgnored(day,taskId){
      const dayIgn=ensureObj(state.domesticIgnored,day);
      dayIgn[taskId]=!dayIgn[taskId];
      persistState(); renderCasa(); renderCasaStats();
    }
    function sendDomesticToFlex(day,task){
      if(!state.flexList.some(t=>t.id===task.id)){
        state.flexList.push({id:task.id,label:task.label,instrucao:task.instrucao||""});
      }
      ensureObj(state.domesticReagendado,day)[task.id]=true;
      if(state.domesticDone[day]) delete state.domesticDone[day][task.id];
      if(state.domesticIgnored[day]) delete state.domesticIgnored[day][task.id];
      persistState(); renderCasa(); renderCasaStats();
    }
    function markFlexAsDoneToday(taskId){
      const day=getSelectedDay();
      const task=state.flexList.find(t=>t.id===taskId); if(!task) return;
      ensureObj(state.domesticDone,day)[taskId]=true;
      state.flexHistory.push({day,id:task.id,label:task.label,instrucao:task.instrucao||"",tipo:task.tipo||"desejavel"});
      state.flexList=state.flexList.filter(t=>t.id!==taskId);
      persistState(); renderCasa(); renderCasaStats();
    }

    function renderCasa(){
      const day = getSelectedDay();
const ctx = getDayContext(day);
const energy = getDayEnergy(day);
const weekday = getWeekdayLabel(day);
badgeCasaDia.textContent = `${weekday} • Dia ${day}`;
const ctxLabel =
  ctx === "casa" ? "Casa" :
  ctx === "pais" ? "Casa dos pais" :
  ctx === "viagem" ? "Viagem" :
  "Pausa";
casaContextLabel.textContent = ctxLabel;

domesticContent.innerHTML = "";

// 👇 NOVO: trata o DIA DE PAUSA aqui e já sai da função
if (ctx === "pausa") {
  domesticContent.innerHTML =
    '<div class="empty-message">Dia de pausa: o que você fizer é bônus. 💙</div>';
  renderFlexList();      // ainda mostra as tarefas reagendadas, se houver
  renderCasaStats();     // badge já mostra a mesma mensagem
  return;
}

const cfg = getDomesticDayConfig(day);
let filtered = filterDomesticByContext(day, ctx, cfg);


      if(ctx==="viagem"){
        domesticContent.innerHTML='<div class="empty-message">Em viagem, tarefas domésticas não entram na conta. Foque em descansar. 🧳</div>';
        renderFlexList(); renderCasaStats(); return;
      }

      function renderGrupo(lista,tituloEmoji,tituloTexto,tipo){
        const bloco=document.createElement("div");
        bloco.className="exercise-block";
        const title=document.createElement("div");
        title.className="exercise-title";
        title.innerHTML=`<span>${tituloEmoji}</span><span>${tituloTexto}</span>`;
        bloco.appendChild(title);

        const ul=document.createElement("ul");
        ul.className="tasks-list";
        lista.forEach(t => {
  // se a tarefa foi "apagada" para este dia, não renderiza
  if (state.domesticDeleted[day] && state.domesticDeleted[day][t.id]) return;

  const li = document.createElement("li");
  li.className = "task-item";

          const done=!!(state.domesticDone[day] && state.domesticDone[day][t.id]);
          const ignored=!!(state.domesticIgnored[day] && state.domesticIgnored[day][t.id]);
          const inFlex=state.flexList.some(f=>f.id===t.id);

          const cb=document.createElement("input");
          cb.type="checkbox";
          cb.checked=done;
          cb.disabled=inFlex;
          cb.onchange=()=>toggleDomesticDone(day,t.id);

          const main=document.createElement("div");
          main.className="task-main";
          const label=document.createElement("div");
          label.className="task-label-main";
          label.textContent=t.label;
          if(ignored || inFlex) label.style.opacity="0.5";
          main.appendChild(label);

          const btns=document.createElement("div");
          btns.className="meal-option-buttons";

          if(t.instrucao && t.instrucao.trim().length){
            const btnPlus=document.createElement("button");
            btnPlus.type="button"; btnPlus.className="btn-icon";
            btnPlus.textContent="+"; btnPlus.title="Ver instruções";

            const note=document.createElement("div");
            note.className="task-details";
            note.textContent=t.instrucao;
            note.style.display="none";
            main.appendChild(note);

            btnPlus.onclick=()=>{
              const vis=note.style.display==="block";
              note.style.display=vis?"none":"block";
              btnPlus.textContent=vis?"+":"−";
            };
            btns.appendChild(btnPlus);
          }

          const btnIgnore=document.createElement("button");
          btnIgnore.type="button"; btnIgnore.className="btn-icon";
          btnIgnore.textContent="⊘";
          btnIgnore.title="Não faz sentido hoje";
          btnIgnore.onclick=()=>markDomesticIgnored(day,t.id);
          btns.appendChild(btnIgnore);

          const btnReag=document.createElement("button");
          btnReag.type="button"; btnReag.className="btn-icon";
          btnReag.textContent="↺";
          btnReag.title="Reagendar para Tarefas reagendadas";
          btnReag.onclick=()=>sendDomesticToFlex(day,t);
          btns.appendChild(btnReag);

 // 🔽 INSIRA AQUI OS NOVOS BOTÕES
    const btnEdit = document.createElement("button");
btnEdit.className = "btn-icon";
btnEdit.textContent = "✎";
btnEdit.title = "Editar tarefa";
btnEdit.addEventListener("click", () => editDomesticTask(day, ctx, tipo, t.id));

btns.appendChild(btnEdit);


    const btnDel = document.createElement("button");
    btnDel.type = "button";
    btnDel.className = "btn-icon";
    btnDel.textContent = "🗑";
    btnDel.title = "Excluir tarefa (personalizada)";
    btnDel.onclick = () => deleteDomesticTask(day, ctx, tipo, t.id);
    btns.appendChild(btnDel);
    // 🔼 ATÉ AQUI

          li.appendChild(cb);
          li.appendChild(main);
          li.appendChild(btns);
          ul.appendChild(li);
        });
        bloco.appendChild(ul);
        domesticContent.appendChild(bloco);
      }

      renderGrupo(filtered.indispensavel,"🟢","Indispensável","indispensavel");
      renderGrupo(filtered.desejavel,"🟡","Desejável","desejavel");

      // adicionar tarefa
      const addArea=document.createElement("div");
      addArea.className="meal-add-area";
      const btnToggle=document.createElement("button");
      btnToggle.type="button";
      btnToggle.textContent="➕ Adicionar tarefa";
      const formDiv=document.createElement("div");
      formDiv.style.display="none";

      const lbl=document.createElement("label");
      lbl.textContent="Nova tarefa para este dia/contexto:";
      const inpNome=document.createElement("input");
      inpNome.type="text"; inpNome.placeholder="Nome da tarefa";
      const taInstr=document.createElement("textarea");
      taInstr.placeholder="Instruções/detalhes (opcional)";
      const selTipo=document.createElement("select");
      const o1=document.createElement("option");
      o1.value="indispensavel"; o1.textContent="Indispensável";
      const o2=document.createElement("option");
      o2.value="desejavel"; o2.textContent="Desejável";
      selTipo.appendChild(o1); selTipo.appendChild(o2);
      selTipo.value="desejavel";

      const btnAdd=document.createElement("button");
      btnAdd.type="button"; btnAdd.textContent="Salvar tarefa";

      btnToggle.onclick=()=>{
        const vis=formDiv.style.display==="block";
        formDiv.style.display=vis?"none":"block";
      };
      btnAdd.onclick=()=>{
        const nome=inpNome.value.trim();
        if(!nome){ alert("Digite o nome da tarefa."); return; }
        const cfgCustom=ensureDomesticCustom(day,ctx);
        const id="dom_custom_"+ctx+"_"+Date.now();
        const nova={id,label:nome,instrucao:taInstr.value.trim()||""};
        const tipo=selTipo.value==="indispensavel"?"indispensavel":"desejavel";
        cfgCustom[tipo].push(nova);
        inpNome.value=""; taInstr.value=""; selTipo.value="desejavel";
        persistState(); renderCasa(); renderCasaStats();
      };

      formDiv.appendChild(lbl);
      formDiv.appendChild(inpNome);
      formDiv.appendChild(taInstr);
      formDiv.appendChild(selTipo);
      formDiv.appendChild(btnAdd);
      addArea.appendChild(btnToggle);
      addArea.appendChild(formDiv);
      domesticContent.appendChild(addArea);

      renderFlexList();
      renderCasaStats();
    }

    function renderFlexList(){
      flexContent.innerHTML="";
      const qtd=state.flexList.length;
      badgeFlexCount.textContent=`${qtd} tarefa(s)`;

      if(!qtd){
        const mini=document.createElement("div");
        mini.className="mini-text";
        mini.textContent="Nenhuma tarefa reagendada ainda. Use ↺ para enviar atividades para cá quando quiser fazer em outro dia.";
        flexContent.appendChild(mini);
        return;
      }

      const ul=document.createElement("ul");
      ul.className="tasks-list";
      state.flexList.forEach(t=>{
        const li=document.createElement("li");
        li.className="task-item";
        const cb=document.createElement("input");
        cb.type="checkbox";
        cb.onchange=()=>{ if(cb.checked) markFlexAsDoneToday(t.id); };
        const main=document.createElement("div");
        main.className="task-main";
        const lbl=document.createElement("div");
        lbl.className="task-label-main";
        lbl.textContent=t.label;
        main.appendChild(lbl);
        if(t.instrucao && t.instrucao.trim().length){
          const note=document.createElement("div");
          note.className="task-details";
          note.textContent=t.instrucao;
          note.style.display="block";
          main.appendChild(note);
        }
        li.appendChild(cb);
        li.appendChild(main);
        ul.appendChild(li);
      });
      flexContent.appendChild(ul);
    }

    function renderCasaStats(){
      const day=getSelectedDay();
      const ctx=getDayContext(day);
      const energy=getDayEnergy(day);
      const cfg=getDomesticDayConfig(day);
      let filtered=filterDomesticByContext(day,ctx,cfg);
      if(energy==="baixa"){
        filtered={indispensavel:filtered.indispensavel,desejavel:[]};
      }

      statsContent.innerHTML="";
      if(ctx==="viagem"){
        badgeCasaResumo.textContent="Em viagem: tarefas domésticas fora da conta.";
        return;
      }
      const ind=filtered.indispensavel;
      const des=filtered.desejavel;
      let totInd=ind.length,totDes=des.length,indFeitas=0,desFeitas=0;

      ind.forEach(t=>{
        const done=!!(state.domesticDone[day] && state.domesticDone[day][t.id]);
        const ign=!!(state.domesticIgnored[day] && state.domesticIgnored[day][t.id]);
        if(ign) return;
        if(done) indFeitas++;
      });
      des.forEach(t=>{
        const done=!!(state.domesticDone[day] && state.domesticDone[day][t.id]);
        const ign=!!(state.domesticIgnored[day] && state.domesticIgnored[day][t.id]);
        if(ign) return;
        if(done) desFeitas++;
      });

      const indPerc=totInd?Math.round(indFeitas/totInd*100):0;
      const desPerc=totDes?Math.round(desFeitas/totDes*100):0;

      if(ctx==="pausa"){
        badgeCasaResumo.textContent="Dia de pausa: o que você fizer é bônus. 💙";
      }else{
        badgeCasaResumo.textContent=`Indispensáveis: ${indFeitas}/${totInd} • Desejáveis: ${desFeitas}/${totDes}`;
      }

      const row=document.createElement("div");
      row.className="stats-row";
      row.innerHTML=`
        <span class="stats-chip">Indispensáveis concluídas: ${indFeitas}/${totInd} (${indPerc}%)</span>
        <span class="stats-chip">Desejáveis concluídas: ${desFeitas}/${totDes} (${desPerc}%)</span>
      `;
      statsContent.appendChild(row);

      const bars=document.createElement("div");
      bars.className="bar-group";
      bars.innerHTML=`
        <div>
          <div class="bar-label">Indispensáveis</div>
          <div class="bar"><div class="bar-fill" style="width:${indPerc}%;"></div></div>
        </div>
        <div>
          <div class="bar-label">Desejáveis</div>
          <div class="bar"><div class="bar-fill" style="width:${desPerc}%;"></div></div>
        </div>
      `;
      statsContent.appendChild(bars);

      const mini=document.createElement("div");
      mini.className="mini-text";
      mini.textContent="Priorize o indispensável. O desejável é bônus — especialmente nos dias de dor ou cansaço.";
      statsContent.appendChild(mini);
    }
    function renderCycleHistory() {
  if (!cycleHistoryContent) return;

  const history = state.cycleHistory || [];
  cycleHistoryContent.innerHTML = "";

  if (!history.length) {
    const msg = document.createElement("div");
    msg.className = "mini-text";
    msg.textContent =
      "Nenhum ciclo arquivado ainda. Quando você usar “Reiniciar ciclo”, o resumo daquele ciclo aparece aqui. 😊";
    cycleHistoryContent.appendChild(msg);
    return;
  }

  // título interno
  const title = document.createElement("div");
  title.className = "section-title";
  title.innerHTML = `<span class="icon">📈</span><span>Evolução entre ciclos</span>`;
  cycleHistoryContent.appendChild(title);

  // encontrar melhor escala para as barras (sempre 0–100)
  history.forEach((snap, idx) => {
    const cicloIdx = idx + 1;
    const foodStats = computeCycleFoodStats(snap.foodState || {});
    const exStats = computeCycleExerciseStats(snap.exDone || {});
    const data = new Date(snap.timestamp || Date.now());
    const dataLabel = data.toLocaleDateString("pt-BR");

    const bloco = document.createElement("div");
    bloco.className = "bar-group";
    bloco.style.marginTop = "0.4rem";

    const header = document.createElement("div");
    header.className = "flex-between";
    header.style.fontSize = "0.8rem";
    header.innerHTML = `<strong>Ciclo ${cicloIdx}</strong><span>${dataLabel}</span>`;
    bloco.appendChild(header);

    const foodLine = document.createElement("div");
    foodLine.innerHTML = `
      <div class="bar-label">Alimentação – refeições dentro do combinado (${foodStats.percDentro}%)</div>
      <div class="bar"><div class="bar-fill" style="width:${foodStats.percDentro}%;"></div></div>
    `;
    bloco.appendChild(foodLine);

    const exLine = document.createElement("div");
    exLine.style.marginTop = "0.2rem";
    exLine.innerHTML = `
      <div class="bar-label">Movimento – dias com exercício (${exStats.percDiasMov}% dos dias)</div>
      <div class="bar"><div class="bar-fill" style="width:${exStats.percDiasMov}%;"></div></div>
    `;
    bloco.appendChild(exLine);

    cycleHistoryContent.appendChild(bloco);
  });

  const mini = document.createElement("div");
  mini.className = "mini-text";
  mini.style.marginTop = "0.5rem";
  mini.textContent =
    "Use esse histórico para perceber tendências: ciclos com mais movimento, mais dias dentro do combinado na alimentação, e ajustes que estão funcionando para você ao longo do tempo. 💙";
  cycleHistoryContent.appendChild(mini);
}


    /* ========== INICIALIZAÇÃO ========== */
    loadState();
    // garantir seleção inicial
    if(!daySelect.value) daySelect.value="1";

    // sincronizar chips com estado salvo
    (function syncChips(){
      const day=getSelectedDay();
      const e=getDayEnergy(day);
      const c=getDayContext(day);
      energyChips.querySelectorAll(".chip").forEach(ch=>ch.classList.toggle("active",ch.getAttribute("data-energy")===e));
      contextChips.querySelectorAll(".chip").forEach(ch=>ch.classList.toggle("active",ch.getAttribute("data-context")===c));
    })();

   function renderAll() {
  renderFood();
  renderExercises();
  renderCasa();
  renderCycleHistory();
}
    renderAll();
    function downloadCycleHistory() {
  const history = state.cycleHistory || [];
  if (!history.length) {
    alert("Ainda não há ciclos arquivados. Use o botão “Reiniciar ciclo” para registrar o primeiro ciclo.");
    return;
  }

  const lines = [];
  const now = new Date();
  lines.push("Histórico de ciclos – Rotina 14 Dias (Fibro)");
  lines.push(`Gerado em: ${now.toLocaleDateString("pt-BR")} ${now.toLocaleTimeString("pt-BR")}`);
  lines.push("");

  history.forEach((snap, idx) => {
    const cicloIdx = idx + 1;
    const data = new Date(snap.timestamp || Date.now());
    const dataLabel = data.toLocaleDateString("pt-BR");
    const foodStats = computeCycleFoodStats(snap.foodState || {});
    const exStats = computeCycleExerciseStats(snap.exDone || {});

    lines.push(`Ciclo ${cicloIdx} – arquivado em ${dataLabel}`);
    lines.push(`  Alimentação: ${foodStats.percDentro}% de refeições dentro do combinado`);
    lines.push(`  Refeições puladas: ${foodStats.percPulado}%`);
    lines.push(`  Refeições fora do combinado: ${foodStats.percNao}%`);
    lines.push(`  Movimento: ${exStats.diasComMov}/${exStats.totalDias} dias com exercício (${exStats.percDiasMov}%)`);
    lines.push("");
  });

  const content = lines.join("\n");
  const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "historico_ciclos_rotina_14_dias.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
if (btnDownloadCycleHistory) {
  btnDownloadCycleHistory.addEventListener("click", downloadCycleHistory);
}

  </script>
</body>
</html>