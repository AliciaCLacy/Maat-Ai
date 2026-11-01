/* Goddess Myriad AI.io — Conversation Response Layer
   Authored Alicia C. Lacy. No LLM API, no paid service, no voice cloning.
   Answers ONLY from creations.json (her works, verbatim titles).
   Work titles stay verbatim in their filed language; only the framing
   sentences around them are translated by the output-language setting.
   If nothing matches, it says so — nothing is invented. */
(function () {
  var creations = [];
  var UI = {
    en: {
      ask: "Ask Goddess Myriad",
      placeholder: "Ask about a creation, a category, or a date…",
      intro: "I answer from Alicia's own works only. If nothing matches, I will say so — nothing invented.",
      found: "Here are works in her library that match:",
      none: "No work in her library matches that yet. Nothing invented. Try a creation name, a category, or a date.",
      showing: "Showing",
      of: "of",
      matches: "matches",
      voiceNote: "Voice input uses your browser, if it supports it. Voice output is her recorded greeting only — her voice is never synthesized or cloned here.",
      langNote: "Work titles stay verbatim, in their filed language. Only these framing sentences change with output language."
    },
    es: {
      ask: "Pregunta a Goddess Myriad",
      placeholder: "Pregunta sobre una creación, una categoría o una fecha…",
      intro: "Respondo solo desde las obras de Alicia. Si nada coincide, lo diré — nada inventado.",
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
      intro: "Je réponds uniquement à partir des œuvres d'Alicia. Si rien ne correspond, je le dirai — rien n'est inventé.",
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
      intro: "Respondo apenas a partir das obras de Alicia. Se nada corresponder, direi isso — nada inventado.",
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
    if (!q) { out.innerHTML = '<div class="empty">' + esc(t("intro")) + "</div>"; return; }
    var hits = search(q);
    if (!hits.length) { out.innerHTML = '<div class="empty">' + esc(t("none")) + "</div>"; return; }
    var html = "<p>" + esc(t("found")) + "</p><p class=\"count-line\">" + esc(t("showing")) + " <strong>" + hits.length + "</strong> " + esc(t("matches")) + "</p>";
    html += hits.map(function (c) {
      return '<article class="card bevel"><h3>' + esc(c.name) + '</h3><div class="meta">' +
        '<span class="chip">' + esc(c.category || "Uncategorized") + "</span>" +
        (c.date ? '<span class="chip dim">' + esc(c.date) + "</span>" : "") +
        (c.status ? '<span class="chip dim">' + esc(c.status) + "</span>" : "") +
        "</div></article>";
    }).join("");
    out.innerHTML = html;
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
