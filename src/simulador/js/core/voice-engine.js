/**
 * Voice SCI-H Engine
 * Text-to-speech for accessibility
 * Hospital de Nunca Jamás - FIFA 2026
 * @module core/voice-engine
 */

/**
 * VoiceEngine - Manages text-to-speech functionality with SCI-H protocol
 */
export class VoiceEngine {
  /**
   * Creates a new VoiceEngine instance
   */
  constructor() {
    this.enabled = true;
    this.isSpeaking = false;
    this.preferredVoice = null;
    this.queue = []; // FIFO strict queue
    this.wasPausedByVoice = false;
    this.currentUtterance = null;
    this.synth = typeof window !== "undefined" ? window.speechSynthesis : null;
    this.checkInterval = null;
  }

  /**
   * Female voice preferences (priority order)
   * @returns {Array<string>} Array of voice name preferences
   */
  getFemaleVoicePrefs() {
    return [
      "Microsoft Sabina",
      "Microsoft Helena",
      "Paulina",
      "Monica",
      "Google español",
      "Google español de Estados Unidos",
      "Victoria",
      "Microsoft Laura",
      "Google US Spanish",
    ];
  }

  /**
   * Initializes the voice engine
   */
  init() {
    if (!this.synth) {
      console.warn("[VoiceEngine] Speech synthesis not supported");
      this.enabled = false;
      return;
    }

    this.loadVoices();

    if (typeof speechSynthesis !== "undefined" && speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }

    // Process queue periodically
    this.checkInterval = setInterval(() => {
      if (this.enabled && !this.isSpeaking && this.queue.length > 0) {
        this.processQueue();
      }
    }, 500);

    console.log("[VoiceEngine] Initialized - FIFO strict queue");
  }

  /**
   * Loads available voices and selects preferred one
   */
  loadVoices() {
    if (!this.synth) return;

    const voices = this.synth.getVoices();
    for (const prefName of this.getFemaleVoicePrefs()) {
      const found = voices.find(
        v => v.name.includes(prefName) || v.name.toLowerCase().includes(prefName.toLowerCase())
      );
      if (found) {
        this.preferredVoice = found;
        console.log("[VoiceEngine] Voice:", found.name);
        break;
      }
    }
    if (!this.preferredVoice) {
      this.preferredVoice = voices.find(v => v.lang.startsWith("es")) || voices[0];
    }
  }

  /**
   * Pauses the simulator if needed for high priority messages
   * @param {string} priority - The message priority
   * @param {Function} togglePauseFn - Function to toggle pause state
   * @returns {boolean} True if pause was triggered
   */
  pauseIfNeeded(priority, togglePauseFn) {
    if (priority === "high" && this.isSpeaking && togglePauseFn) {
      this.wasPausedByVoice = true;
      return true;
    }
    return false;
  }

  /**
   * Resumes the simulator if it was paused by voice
   * @param {Function} togglePauseFn - Function to toggle pause state
   * @param {Function} showToastFn - Optional function to show toast message
   */
  resumeIfPaused(togglePauseFn, showToastFn) {
    if (this.wasPausedByVoice && togglePauseFn) {
      setTimeout(() => {
        this.wasPausedByVoice = false;
        if (showToastFn) {
          showToastFn("▶ Simulador reanudado");
        }
      }, 800);
    }
  }

  /**
   * Adds a message to the speech queue
   * @param {string} text - The text to speak
   * @param {string} priority - The message priority ('normal' or 'high')
   * @param {boolean} compressed - Whether to compress the text
   * @param {Function} togglePauseFn - Optional function to toggle pause
   * @param {Function} showToastFn - Optional function to show toast
   */
  speak(text, priority = "normal", compressed = false, togglePauseFn, showToastFn) {
    if (!this.enabled || !text) return;

    // If critical and we're speaking, pause and queue
    if (priority === "high" && this.isSpeaking && togglePauseFn) {
      this.pauseIfNeeded(priority, togglePauseFn);
      if (showToastFn) {
        showToastFn("⏸ Pausado - Escuchando mensaje...");
      }
    }

    // Add to queue
    this.queue.push({
      text,
      priority,
      compressed,
      id: Date.now(),
    });

    // Log queue
    console.log(`[Voice] Queued. Queue: ${this.queue.length}, Speaking: ${this.isSpeaking}`);

    this.updateQueueIndicator();

    // Try to process
    this.processQueue();
  }

  /**
   * Processes the speech queue
   */
  processQueue() {
    // Don't process if already speaking
    if (this.isSpeaking) {
      return;
    }

    if (this.queue.length === 0) return;

    const item = this.queue.shift();
    const text = item.compressed ? this.compressText(item.text) : item.text;

    console.log(`[Voice] Speaking (${text.length} chars): ${text.substring(0, 60)}...`);

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    if (this.preferredVoice) {
      utterance.voice = this.preferredVoice;
    }
    utterance.lang = "es-MX";
    utterance.rate = item.compressed ? 1.2 : 1.1;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
      this.isSpeaking = true;
      this.updateSpeakingState(true);
    };

    utterance.onend = () => {
      console.log("[Voice] Message completed");
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.updateSpeakingState(false);
      this.updateQueueIndicator();
      this.resumeIfPaused();

      // Wait 1 second before next message
      setTimeout(() => this.processQueue(), 1000);
    };

    utterance.onerror = e => {
      console.error("[Voice] Error:", e.error);
      this.isSpeaking = false;
      this.currentUtterance = null;
      this.updateSpeakingState(false);
      this.resumeIfPaused();
      // Try to continue with queue
      setTimeout(() => this.processQueue(), 500);
    };

    if (this.synth) {
      this.synth.speak(utterance);
    }
  }

  /**
   * Compresses text when there are many messages in queue
   * @param {string} text - The text to compress
   * @returns {string} Compressed text
   */
  compressText(text) {
    if (this.queue.length < 2) return text;

    return text
      .replace(/Tiempo simulado: /g, "T ")
      .replace(/ reporta: /g, ": ")
      .replace(/Atención\. Mensaje prioritario\./g, "Prioritario.")
      .replace(/Comunicación\./g, "Aviso.")
      .replace(/Nueva información\./g, "Info.")
      .replace(/ por favor/gi, "")
      .replace(/ le informamos que/gi, "")
      .replace(/ se le comunica que/gi, "");
  }

  /**
   * Toggles voice on/off
   * @param {Function} showToastFn - Optional function to show toast
   * @returns {boolean} The new enabled state
   */
  toggle(showToastFn) {
    this.enabled = !this.enabled;

    if (!this.enabled) {
      // Cancel everything
      if (this.synth) {
        this.synth.cancel();
      }
      this.queue = [];
      this.isSpeaking = false;
      this.currentUtterance = null;

      if (this.wasPausedByVoice) {
        this.resumeIfPaused();
      }

      this.updateSpeakingState(false);
      this.updateMutedState(true);
    } else {
      this.updateMutedState(false);
      this.speak("Síntesis de voz activada");
    }
    return this.enabled;
  }

  /**
   * Clears the speech queue
   */
  clearQueue() {
    this.queue = [];
    if (this.synth) {
      this.synth.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
    this.updateQueueIndicator();
  }

  /**
   * Updates the visual queue indicator
   */
  updateQueueIndicator() {
    if (typeof document === "undefined") return;

    const indicator = document.getElementById("voice-queue-indicator");
    if (!indicator) return;

    const pending = this.queue.length;
    if (pending > 0) {
      indicator.textContent = `[${pending} pendiente${pending > 1 ? "s" : ""}]`;
      indicator.style.display = "inline";
    } else {
      indicator.style.display = "none";
    }
  }

  /**
   * Updates the speaking state visual indicator
   * @param {boolean} speaking - Whether the engine is speaking
   */
  updateSpeakingState(speaking) {
    if (typeof document === "undefined") return;

    const btn = document.getElementById("btn-voice");
    if (btn) {
      if (speaking) {
        btn.classList.add("speaking");
      } else {
        btn.classList.remove("speaking");
      }
    }
  }

  /**
   * Updates the muted state visual indicator
   * @param {boolean} muted - Whether the engine is muted
   */
  updateMutedState(muted) {
    if (typeof document === "undefined") return;

    const btn = document.getElementById("btn-voice");
    if (btn) {
      if (muted) {
        btn.classList.add("muted");
        btn.textContent = "🔇 Voz OFF";
      } else {
        btn.classList.remove("muted");
        btn.textContent = "🔊 Voz ON";
      }
    }
  }

  /**
   * Gets the current engine status
   * @returns {Object} Status object
   */
  getStatus() {
    return {
      enabled: this.enabled,
      isSpeaking: this.isSpeaking,
      queueLength: this.queue.length,
      pausedByVoice: this.wasPausedByVoice,
    };
  }

  /**
   * Destroys the voice engine and cleans up
   */
  destroy() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }
    this.clearQueue();
  }
}

/**
 * IMSS nomenclature for medical abbreviations
 * @constant {Object}
 */
export const IMSS_NOMENCLATURE = {
  // Main protocols
  SMV: "Saldo Masivo de Víctimas",
  "SMV-H": "Saldo Masivo de Víctimas Hospitalario",
  "EVAC-H": "Evacuación Hospitalaria",
  "SCI-H": "Sistema de Comando de Incidentes Hospitalario",
  QBRNE: "Químico, Biológico, Radiológico, Nuclear o Explosivo",
  "INGRID-H": "Inclusión de Personas con Discapacidad",
  "BCP-H": "Continuidad de Operaciones Hospitalaria",
  "PH-RED": "Plan Hospitalario de Respuesta ante Emergencias y Desastres",

  // Institutions
  CRUM: "Centro Regulador de Urgencias Médicas",
  CVOED: "Coordinación de Vigilancia Epidemiológica y Desastres",
  RISS: "Red Integral de Servicios de Salud",
  IMSS: "Instituto Mexicano del Seguro Social",

  // Hospital areas
  UCI: "Unidad de Cuidados Intensivos",
  COE: "Centro de Operaciones de Emergencia",
  PM: "Puesto de Mando",
  URGENCIAS: "Servicio de Urgencias",

  // Procedures
  VM: "Ventilación Mecánica",
  ECMO: "Oxigenación por Membrana Extracorpórea",
  EPP: "Equipo de Protección Personal",
  PAI: "Plan de Acción del Incidente",

  // Classifications
  "QBRN-E": "Químico, Biológico, Radiológico, Nuclear o Explosivo",
  CENACOM: "Centro Nacional de Comunicaciones",
  CENAPRED: "Centro Nacional de Prevención de Desastres",
  CNSNS: "Comisión Nacional de Seguridad Nuclear",

  // Medical conditions
  DM2: "Diabetes Mellitus tipo 2",
  DM1: "Diabetes Mellitus tipo 1",
  VIH: "Virus de Inmunodeficiencia Humana",
  O2: "Oxígeno",
  IAAS: "Infecciones Asociadas a la Atención en Salud",

  // Triage
  START: "Sistema de Triage Rápido",
  SIEVE: "Sistema de Clasificación de Víctimas",
};

/**
 * SCI-H priority prefixes
 * @constant {Object}
 */
export const SCIH_PRIORITY_PREFIX = {
  critico: "Atención. Mensaje prioritario.",
  radio: "Comunicación.",
  nuevo: "Aviso.",
};

/**
 * Channel name expansions
 * @constant {Object}
 */
export const CHANNEL_NAMES = {
  "🚑 ARRIBO FÍSICO": "Arribo físico de unidades",
  "📞 LLAMADA ANÓNIMA": "Llamada telefónica anónima",
  "📞 LLAMADA DIRECTA": "Llamada telefónica directa",
  "📻 RADIO INTERNO": "Radio interno hospitalario",
  "📻 RADIO EXTERNO": "Radio externo institucional",
  "📱 MENSAJE ESCRITO": "Mensaje escrito oficial",
  "📱 MENSAJE": "Mensaje institucional",
  "📺 MEDIOS DE COMUNICACIÓN": "Medios de comunicación",
  "🚨 ALERTA SÍSMICA": "Alerta sísmica automatizada",
  "📻 CRUM OFICIAL": "Comunicación oficial del CRUM",
  "📻 CRUM · ACTUALIZACIÓN": "Actualización del CRUM",
  "📻 CRUM · CIERRE": "Comunicación de cierre del CRUM",
  "📞 LLAMADA · RISS": "Comunicación con RISS",
};

/**
 * Expands IMSS abbreviations in text
 * @param {string} text - Text with abbreviations
 * @returns {string} Text with expanded abbreviations
 */
export function expandIMSSAbbreviations(text) {
  let expanded = text;
  for (const [abbr, fullName] of Object.entries(IMSS_NOMENCLATURE)) {
    const regex = new RegExp(`\\b${abbr}\\b`, "g");
    expanded = expanded.replace(regex, fullName);
  }
  return expanded;
}

/**
 * Cleans and normalizes text for speech synthesis
 * @param {string} text - Text to clean
 * @returns {string} Cleaned text
 */
export function cleanVoiceText(text) {
  if (!text) return "";

  return (
    text
      // Remove emojis
      .replace(/[\u{1F600}-\u{1F64F}]/gu, "")
      .replace(/[\u{1F300}-\u{1F5FF}]/gu, "")
      .replace(/[\u{1F680}-\u{1F6FF}]/gu, "")
      .replace(/[\u{2600}-\u{26FF}]/gu, "")
      .replace(/[\u{2700}-\u{27BF}]/gu, "")
      .replace(/[\u{1F900}-\u{1F9FF}]/gu, "")
      // Expand T+
      .replace(/T\+(\d+)/gi, "Tiempo más $1 minutos")
      // Expand math symbols
      .replace(/\+/g, " más ")
      .replace(/\*/g, " por ")
      .replace(/\//g, " sobre ")
      // Clean extra spaces
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * Builds a SCI-H compliant message
 * @param {Object} injector - The injector object
 * @returns {string} Formatted message
 */
export function buildSCIHMessage(injector) {
  const priority = SCIH_PRIORITY_PREFIX[injector.tipo] || "Mensaje.";
  const timeStr = `Tiempo simulado: T+${String(injector.t).padStart(2, "0")}.`;
  const channel = CHANNEL_NAMES[injector.canal] || injector.canal;
  const emisor = injector.emisor;

  // Clean and expand content
  let contenido = cleanVoiceText(injector.texto);
  contenido = expandIMSSAbbreviations(contenido);

  return `${priority} ${timeStr} ${channel}. ${emisor} reporta: ${contenido}`;
}

/**
 * Creates a singleton instance of VoiceEngine
 * @type {VoiceEngine}
 */
export const voiceEngine = new VoiceEngine();

// Initialize on load if in browser
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => voiceEngine.init());
  } else {
    voiceEngine.init();
  }
}

export default VoiceEngine;
