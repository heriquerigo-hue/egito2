document.addEventListener("DOMContentLoaded", () => {
  // Navegação móvel
  const menuToggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (menuToggle && nav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "×" : "☰";
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "☰";
    }));
  }

  // Cartões de conhecimento: toque para abrir e destacar o conteúdo.
  document.querySelectorAll(".knowledge-card").forEach(card => {
    const description = card.querySelector("p");
    if (description) description.hidden = true;
    const toggleCard = () => {
      const isOpen = card.classList.toggle("is-open");
      card.setAttribute("aria-expanded", String(isOpen));
      if (description) description.hidden = !isOpen;
    };
    card.addEventListener("click", toggleCard);
    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleCard(); }
    });
  });

  // Linha do tempo interativa
  const timelineData = {
    unificacao: ["Unificação do Egito", "Tradicionalmente, o início do período dinástico é associado à unificação do Alto e do Baixo Egito, ligada ao governante Menés/Narmer."],
    piramides: ["Era das grandes pirâmides", "Durante o Reino Antigo, especialmente na IV Dinastia, foram construídas as famosas pirâmides de Gizé, incluindo a de Quéops."],
    novo: ["O Novo Império", "Período de expansão e prosperidade em que governantes como Hatshepsut, Tutmés III e Ramsés II marcaram a história do Egito."],
    greco: ["A chegada de Alexandre", "Em 332 a.C., Alexandre, o Grande, conquistou o Egito. Depois, a dinastia ptolomaica governou até a incorporação romana em 30 a.C."]
  };
  document.querySelectorAll(".time-tab").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll(".time-tab").forEach(tab => tab.classList.remove("active"));
    button.classList.add("active");
    const data = timelineData[button.dataset.period];
    document.getElementById("timeline-title").textContent = data[0];
    document.getElementById("timeline-text").textContent = data[1];
  }));

  // Modais informativos
  document.querySelectorAll("[data-open-modal]").forEach(button => button.addEventListener("click", () => {
    const modal = document.getElementById(button.dataset.openModal);
    if (modal) modal.classList.add("open");
  }));
  document.querySelectorAll(".modal").forEach(modal => {
    modal.querySelector(".modal-close")?.addEventListener("click", () => modal.classList.remove("open"));
    modal.addEventListener("click", event => { if (event.target === modal) modal.classList.remove("open"); });
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") document.querySelectorAll(".modal.open").forEach(modal => modal.classList.remove("open"));
  });

  // Jogo de construção da pirâmide
  const stepButtons = [...document.querySelectorAll("[data-step]")];
  if (stepButtons.length) {
    const stepTexts = [
      "Etapa 1: planejar a obra, definir medidas e organizar os trabalhadores.",
      "Etapa 2: preparar o terreno e estabelecer uma base nivelada.",
      "Etapa 3: extrair, transportar e posicionar os blocos de pedra.",
      "Etapa 4: erguer as camadas e concluir o acabamento externo."
    ];
    let completed = new Set();
    const updatePyramid = () => {
      stepButtons.forEach(button => button.classList.toggle("done", completed.has(Number(button.dataset.step))));
      document.getElementById("pyramid-progress").style.width = `${completed.size * 25}%`;
      const pyramidVisual = document.querySelector(".pyramid-visual");
      pyramidVisual.classList.remove("built", "stage-1", "stage-2", "stage-3", "stage-4");
      if (completed.size) pyramidVisual.classList.add(`stage-${Math.max(...completed) + 1}`);
      pyramidVisual.classList.toggle("built", completed.size === 4);
      if (completed.size === 4) {
        document.getElementById("pyramid-instruction").textContent = "Construção concluída!";
        document.getElementById("pyramid-feedback").textContent = "Muito bem! Uma obra dessa escala dependia de planejamento, recursos e coordenação durante muito tempo.";
      }
    };
    stepButtons.forEach(button => button.addEventListener("click", () => {
      const step = Number(button.dataset.step);
      if (step > 0 && !completed.has(step - 1)) {
        document.getElementById("pyramid-instruction").textContent = "Siga a ordem das etapas para construir a pirâmide.";
        document.getElementById("pyramid-feedback").textContent = "Ainda falta concluir a etapa anterior.";
        return;
      }
      completed.add(step);
      document.getElementById("pyramid-instruction").textContent = stepTexts[step];
      document.getElementById("pyramid-feedback").textContent = completed.size === 4 ? "Todas as etapas foram concluídas." : "Etapa registrada. Continue para avançar na construção.";
      updatePyramid();
    }));
    document.getElementById("reset-pyramid")?.addEventListener("click", () => {
      completed = new Set();
      document.getElementById("pyramid-instruction").textContent = "Escolha a primeira etapa para começar.";
      document.getElementById("pyramid-feedback").textContent = "Dica: a construção exigia organização, mão de obra e logística.";
      updatePyramid();
    });
  }

  // Quiz com pontuação
  const quizOptions = document.getElementById("quiz-options");
  if (quizOptions) {
    const questions = [
      {q:"Qual rio foi essencial para o desenvolvimento do Egito Antigo?", options:["Rio Tigre","Rio Nilo","Rio Eufrates","Rio Jordão"], answer:1, explain:"O Nilo fornecia água, transporte e cheias que fertilizavam as terras agrícolas."},
      {q:"Qual era uma das funções dos escribas?", options:["Construir todas as pirâmides sozinhos","Registrar informações e impostos","Governar como faraós","Comandar as cheias do Nilo"], answer:1, explain:"Os escribas dominavam a escrita e registravam informações importantes para a administração."},
      {q:"Por que muitos egípcios praticavam a mumificação?", options:["Para preservar o corpo ligado às crenças após a morte","Para preparar o corpo para viagens pelo Nilo","Para identificar os agricultores","Para celebrar o início das cheias"], answer:0, explain:"A preservação do corpo fazia parte de crenças e rituais relacionados à vida após a morte."},
      {q:"Para que serviam principalmente as pirâmides reais?", options:["Como mercados","Como fortalezas romanas","Como monumentos funerários ligados aos faraós","Como reservatórios de água"], answer:2, explain:"As pirâmides integravam complexos funerários reais e estavam ligadas às crenças sobre a morte e a realeza."},
      {q:"O que eram os hieróglifos?", options:["Um tipo de embarcação","Um sistema de escrita","Uma técnica de irrigação","Uma moeda"], answer:1, explain:"Os hieróglifos eram sinais usados para registrar sons, palavras e ideias em diferentes contextos."}
    ];
    let index = 0, score = 0, answered = false;
    const renderQuestion = () => {
      const q = questions[index];
      document.getElementById("quiz-count").textContent = `PERGUNTA ${index + 1} DE ${questions.length}`;
      document.getElementById("quiz-question").textContent = q.q;
      document.getElementById("quiz-score").textContent = score;
      document.getElementById("quiz-progress").style.width = `${index / questions.length * 100}%`;
      document.getElementById("quiz-feedback").textContent = "Escolha uma resposta para continuar.";
      document.getElementById("quiz-next").disabled = true;
      document.getElementById("quiz-next").textContent = index === questions.length - 1 ? "Ver resultado →" : "Próxima pergunta →";
      answered = false;
      quizOptions.innerHTML = "";
      q.options.forEach((option, i) => {
        const button = document.createElement("button");
        button.textContent = option;
        button.dataset.answer = i;
        button.addEventListener("click", () => {
          if (answered) return;
          answered = true;
          const correct = i === q.answer;
          if (correct) score++;
          [...quizOptions.children].forEach((b, j) => {
            b.disabled = true;
            if (j === q.answer) b.classList.add("correct");
            else if (j === i) b.classList.add("incorrect");
          });
          document.getElementById("quiz-score").textContent = score;
          document.getElementById("quiz-feedback").textContent = `${correct ? "Resposta correta! " : "Quase! "}${q.explain}`;
          document.getElementById("quiz-next").disabled = false;
        });
        quizOptions.appendChild(button);
      });
    };
    document.getElementById("quiz-next").addEventListener("click", () => {
      if (!answered) return;
      if (index < questions.length - 1) { index++; renderQuestion(); }
      else {
        document.getElementById("quiz-count").textContent = "DESAFIO CONCLUÍDO";
        document.getElementById("quiz-question").textContent = `Você acertou ${score} de ${questions.length} perguntas!`;
        document.getElementById("quiz-progress").style.width = "100%";
        quizOptions.innerHTML = "";
        document.getElementById("quiz-feedback").textContent = score === 5 ? "Impressionante! Você conhece muito bem o Egito Antigo." : score >= 3 ? "Muito bem! Explore o museu e tente novamente para melhorar sua pontuação." : "Continue explorando o museu e volte para tentar de novo.";
        const next = document.getElementById("quiz-next");
        next.disabled = false; next.textContent = "Jogar novamente ↻";
        next.onclick = () => { index = 0; score = 0; next.onclick = null; renderQuestion(); };
      }
    });
    renderQuestion();
  }

  // Mapa clicável
  const places = {
    alexandria:["Alexandria","Cidade fundada por Alexandre, o Grande, em 331 a.C. Tornou-se um importante centro cultural do mundo helenístico."],
    giza:["Gizé","Local das grandes pirâmides e da Grande Esfinge, monumentos associados à realeza do Reino Antigo."],
    memphis:["Mênfis","Antiga capital e importante centro político e religioso próximo à região do delta do Nilo."],
    luxor:["Tebas e Luxor","Região associada a grandes templos, como Karnak e Luxor, e a importantes túmulos reais."],
    aswan:["Assuã","Região do sul do Egito ligada a pedreiras, comércio e ao transporte de materiais como o granito."]
  };
  document.querySelectorAll("[data-place]").forEach(button => button.addEventListener("click", () => {
    document.querySelectorAll("[data-place]").forEach(pin => pin.classList.remove("selected"));
    button.classList.add("selected");
    const place = places[button.dataset.place];
    document.getElementById("map-title").textContent = place[0];
    document.getElementById("map-text").textContent = place[1];
  }));

  // Jogo de memória
  const memoryGrid = document.getElementById("memory-grid");
  if (memoryGrid) {
    const symbols = [
    {symbol:"𓋹", name:"Ankh", meaning:"Vida e continuidade."},
    {symbol:"𓂀", name:"Olho de Hórus", meaning:"Proteção e vigilância."},
    {symbol:"𓆣", name:"Escaravelho", meaning:"Renovação e renascimento."},
    {symbol:"☥", name:"Cajado e flagelo", meaning:"Autoridade do faraó."},
    {symbol:"𓇳", name:"Disco solar", meaning:"Sol e força criadora."},
    {symbol:"𓉐", name:"Casa", meaning:"Lar e espaço de vida."}
  ];
    let cards = [], flipped = [], matched = new Set(), moves = 0, locked = false;
    const shuffle = array => array.sort(() => Math.random() - 0.5);
    const updateMemory = () => {
      document.getElementById("memory-moves").textContent = moves;
      document.getElementById("memory-pairs").textContent = matched.size;
    };
    const resetMemory = () => {
      cards = shuffle([...symbols, ...symbols].map((symbol, id) => ({symbol, id})));
      flipped = []; matched = new Set(); moves = 0; locked = false;
      memoryGrid.innerHTML = "";
      cards.forEach((card, index) => {
        const button = document.createElement("button");
        button.className = "memory-card";
        button.setAttribute("aria-label", "Carta fechada");
        button.textContent = "𓆃";
        button.addEventListener("click", () => {
          if (locked || flipped.includes(index) || matched.has(card.symbol)) return;
          button.innerHTML = `<span>${card.symbol.symbol}</span><small>${card.symbol.name}<br>${card.symbol.meaning}</small>`;
          button.classList.add("flipped");
          button.setAttribute("aria-label", `Carta ${card.symbol.name}: ${card.symbol.meaning}`);
          flipped.push(index);
          if (flipped.length === 2) {
            moves++;
            locked = true;
            const [a, b] = flipped;
            if (cards[a].symbol === cards[b].symbol) {
              matched.add(cards[a].symbol);
              [a,b].forEach(i => {
                memoryGrid.children[i].classList.add("matched");
                memoryGrid.children[i].classList.remove("flipped");
              });
              flipped = []; locked = false;
              document.getElementById("memory-message").textContent = matched.size === 6 ? `Parabéns! Você encontrou todos os pares em ${moves} tentativas.` : "Par encontrado! Continue procurando.";
            } else {
              setTimeout(() => {
                [a,b].forEach(i => {
                  memoryGrid.children[i].textContent = "𓆃";
                  memoryGrid.children[i].classList.remove("flipped");
                  memoryGrid.children[i].setAttribute("aria-label", "Carta fechada");
                });
                flipped = []; locked = false;
              }, 750);
              document.getElementById("memory-message").textContent = "Esses símbolos não formam um par. Tente novamente!";
            }
            updateMemory();
          }
        });
        memoryGrid.appendChild(button);
      });
      updateMemory();
      document.getElementById("memory-message").textContent = "Dica: observe os símbolos com atenção antes de escolher outra carta.";
    };
    document.getElementById("memory-reset").addEventListener("click", resetMemory);
    resetMemory();
  }
});

// Galeria das pirâmides: revelar nome e contexto ao selecionar uma imagem.
document.querySelectorAll('.pyramid-choice').forEach((choice) => {
  const originalLabel = choice.querySelector('span')?.textContent || 'Toque para descobrir';
  choice.addEventListener('click', () => {
    document.querySelectorAll('.pyramid-choice').forEach((item) => {
      const isSelected = item === choice;
      item.classList.toggle('selected', isSelected);
      const caption = item.querySelector('span');
      if (!caption) return;
      caption.innerHTML = isSelected
        ? `<strong>${item.dataset.pyramidName}</strong><small>${item.dataset.pyramidInfo}</small>`
        : originalLabel;
    });
  });
});
