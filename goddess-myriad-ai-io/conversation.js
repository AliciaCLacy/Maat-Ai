/* Goddess Myriad AI.io — Conversation Response Layer
   Authored Alicia C. Lacy. No LLM API, no paid service, no voice cloning.
   SIMPLE, PUBLIC-FACING FUNCTION ONLY: prompt, answer, conversation.
   The world sees simple answers. It does NOT see the build, the brain
   markup, internal codes, families, or portions — those stay private.
   Answers ONLY from creations.json (her works, verbatim titles).
   Work titles stay verbatim in their filed language; only the framing
   sentences around them are translated by the output-language setting.
   If nothing matches, it says so — nothing is invented.
   CULTURAL AMBASSADOR RULE: cultural knowledge pulls from cultural
   resources that are FACT, not speculation. Speculation is never
   presented as fact. */
(function () {
  var creations = [];
  var UI = {
    en: {
      ask: "Ask Goddess Myriad",
      placeholder: "Ask about a creation, a category, or a date…",
      intro: "Goddess Myriad bridges culture — the first model of its kind, housing and building from past to present, especially for Black Americans. Ask, and I will answer simply, from fact, not speculation.",
      found: "Here is what I found:",
      none: "I don't have that yet. Nothing invented — ask about another work, or a cultural topic, and I will say plainly what is fact and what is not yet known.",
      showing: "Showing",
      of: "of",
      matches: "matches",
      voiceNote: "Voice input uses your browser, if it supports it. Voice output is her recorded greeting only — her voice is never synthesized or cloned here.",
      langNote: "Work titles stay verbatim, in their filed language. Only these framing sentences change with output language."
    },
    es: {
      ask: "Pregunta a Goddess Myriad",
      placeholder: "Pregunta sobre una creación, una categoría o una fecha…",
      intro: "Goddess Myriad une culturas — el primer modelo de su tipo, del pasado al presente, especialmente para los afroamericanos. Pregunta, y responderé con sencillez, desde los hechos, no desde la especulación.",
      found: "Estas son las obras de su biblioteca que coinciden:",
      none: "Ninguna obra de su biblioteca coincide todavía con eso. Nada inventado. Prueba con un nombre de creación, una categoría o una fecha.",
      showing: "Mostrando",
      of: "de",
      matches: "coincidencias",
      voiceNote: "La entrada por voz usa tu navegador, si lo admite. La salida de voz es solo su saludo grabado — su voz nunca se sintetiza ni se clona aquí.",
      langNote: "Los títulos de las obras se mantienen textuales, en su idioma archivado. Solo estas frases cambian con el idioma de salida."
    },
    fr: {
      ask: "Demandez à Goddess Myriad",
      placeholder: "Posez une question sur une création, une catégorie ou une date…",
      intro: "Goddess Myriad relie les cultures — le premier modèle de son genre, du passé au présent, en particulier pour les Afro-Américains. Posez une question, je répondrai simplement, à partir des faits, non de la spéculation.",
      found: "Voici les œuvres de sa bibliothèque qui correspondent :",
      none: "Aucune œuvre de sa bibliothèque ne correspond encore à cela. Rien n'est inventé. Essayez un nom de création, une catégorie ou une date.",
      showing: "Affichage de",
      of: "sur",
      matches: "résultats",
      voiceNote: "L'entrée vocale utilise votre navigateur, s'il le prend en charge. La sortie vocale est uniquement son salut enregistré — sa voix n'est jamais synthétisée ni clonée ici.",
      langNote: "Les titres des œuvres restent textuels, dans leur langue archivée. Seules ces phrases changent avec la langue de sortie."
    },
    pt: {
      ask: "Pergunte à Goddess Myriad",
      placeholder: "Pergunte sobre uma criação, uma categoria ou uma data…",
      intro: "Goddess Myriad conecta culturas — o primeiro modelo de seu tipo, do passado ao presente, especialmente para afro-americanos. Pergunte, e responderei com simplicidade, a partir de fatos, não de especulação.",
      found: "Estas são as obras da biblioteca dela que correspondem:",
      none: "Nenhuma obra da biblioteca dela corresponde a isso ainda. Nada inventado. Tente um nome de criação, uma categoria ou uma data.",
      showing: "Mostrando",
      of: "de",
      matches: "resultados",
      voiceNote: "A entrada por voz usa o seu navegador, se ele suportar. A saída de voz é apenas a saudação gravada dela — a voz dela nunca é sintetizada nem clonada aqui.",
      langNote: "Os títulos das obras permanecem textuais, no idioma arquivado. Apenas estas frases mudam com o idioma de saída."
    }
  };
  var SPEECH = { en: "en-US", es: "es-ES", fr: "fr-FR", pt: "pt-BR" };
  function esc(s) {
    return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function t(key) {
    var lang = document.getElementById("outLang").value || "en";
    return (UI[lang] && UI[lang][key]) || UI.en[key];
  }
  function renderIntro() {
    document.getElementById("talkTitle").textContent = t("ask");
    document.getElementById("talkInput").placeholder = t("placeholder");
    document.getElementById("talkIntro").textContent = t("intro");
    document.getElementById("talkVoiceNote").textContent = t("voiceNote");
    document.getElementById("talkLangNote").textContent = t("langNote");
  }
  function search(q) {
    var words = q.toLowerCase().split(/\s+/).filter(function (w) { return w.length > 2; });
    if (!words.length) return [];
    return creations.filter(function (c) {
      var hay = ((c.name || "") + " " + (c.category || "") + " " + (c.status || "") + " " + (c.date || "")).toLowerCase();
      return words.every(function (w) { return hay.indexOf(w) !== -1; });
    }).slice(0, 8);
  }
  function answer() {
    var q = document.getElementById("talkInput").value.trim();
    var out = document.getElementById("talkOutput");
    if (!q) return;
    var hits = search(q);
    // Simple conversation: prompt, then answer. No internal codes,
    // no families, no dates-as-markup, no counts, no portions.
    var turn = '<div class="talk-turn"><p class="talk-prompt">You: ' + esc(q) + '</p>';
    if (!hits.length) {
      turn += '<p class="talk-answer">Goddess Myriad: ' + esc(t("none")) + '</p></div>';
    } else {
      turn += '<p class="talk-answer">Goddess Myriad: ' + esc(t("found")) + '</p><ul class="talk-list">' +
        hits.map(function (c) { return "<li>" + esc(c.name) + "</li>"; }).join("") + "</ul></div>";
    }
    if (out.querySelector(".empty")) out.innerHTML = "";
    out.innerHTML += turn;
    document.getElementById("talkInput").value = "";
    out.scrollTop = out.scrollHeight;
  }
  function setQuery(q) {
    document.getElementById("talkInput").value = q;
    answer();
  }
  document.addEventListener("DOMContentLoaded", function () {
    fetch("creations.json").then(function (r) { return r.json(); }).then(function (data) {
      creations = data.creations || [];
    }).catch(function () { creations = []; });
    renderIntro();
    document.getElementById("outLang").addEventListener("change", renderIntro);
    document.getElementById("inLang").addEventListener("change", function () {
      document.getElementById("talkInput").lang = SPEECH[this.value] || "en-US";
    });
    document.getElementById("talkAsk").addEventListener("click", answer);
    document.getElementById("talkInput").addEventListener("keydown", function (e) {
      if (e.key === "Enter") answer();
    });
    document.querySelectorAll("[data-suggest]").forEach(function (el) {
      el.addEventListener("click", function () { setQuery(el.dataset.suggest); });
    });
    var voiceBtn = document.getElementById("talkVoice");
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { voiceBtn.disabled = true; voiceBtn.textContent = "Voice input not supported in this browser"; return; }
    voiceBtn.addEventListener("click", function () {
      var rec = new SR();
      rec.lang = SPEECH[document.getElementById("inLang").value] || "en-US";
      rec.onresult = function (ev) {
        document.getElementById("talkInput").value = ev.results[0][0].transcript;
        answer();
      };
      rec.start();
    });
  });
})();
