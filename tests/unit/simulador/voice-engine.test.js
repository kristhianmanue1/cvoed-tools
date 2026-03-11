/**
 * Unit Tests for VoiceEngine
 * Hospital de Nunca Jamás - FIFA 2026
 */

import {
  VoiceEngine,
  voiceEngine,
  IMSS_NOMENCLATURE,
  SCIH_PRIORITY_PREFIX,
  CHANNEL_NAMES,
  expandIMSSAbbreviations,
  cleanVoiceText,
  buildSCIHMessage,
} from "@/src/simulador/js/core/voice-engine.js";

// Mock speechSynthesis
const mockSpeechSynthesis = {
  getVoices: jest.fn(() => []),
  speak: jest.fn(),
  cancel: jest.fn(),
  pause: jest.fn(),
  resume: jest.fn(),
};

const mockUtterance = {
  onstart: null,
  onend: null,
  onerror: null,
};

describe("VoiceEngine", () => {
  let voiceEngineInstance;

  beforeAll(() => {
    // Mock window.speechSynthesis
    global.speechSynthesis = mockSpeechSynthesis;
    global.SpeechSynthesisUtterance = class MockUtterance {
      constructor(text) {
        this.text = text;
        this.lang = "es-MX";
        this.rate = 1.0;
        this.pitch = 1.0;
        this.volume = 1.0;
        this.onstart = null;
        this.onend = null;
        this.onerror = null;
      }
    };
  });

  beforeEach(() => {
    voiceEngineInstance = new VoiceEngine();
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (voiceEngineInstance.checkInterval) {
      clearInterval(voiceEngineInstance.checkInterval);
    }
  });

  describe("constructor", () => {
    test("should initialize with default values", () => {
      expect(voiceEngineInstance.enabled).toBe(true);
      expect(voiceEngineInstance.isSpeaking).toBe(false);
      expect(voiceEngineInstance.queue).toEqual([]);
      expect(voiceEngineInstance.wasPausedByVoice).toBe(false);
      expect(voiceEngineInstance.currentUtterance).toBeNull();
    });

    test("should have female voice preferences", () => {
      const prefs = voiceEngineInstance.getFemaleVoicePrefs();
      expect(Array.isArray(prefs)).toBe(true);
      expect(prefs).toContain("Microsoft Sabina");
      expect(prefs).toContain("Google español");
    });
  });

  describe("initialization", () => {
    test("should initialize without errors", () => {
      expect(() => voiceEngineInstance.init()).not.toThrow();
    });

    test("should set enabled to false if speech synthesis not available", () => {
      voiceEngineInstance.synth = null;
      voiceEngineInstance.init();
      expect(voiceEngineInstance.enabled).toBe(false);
    });
  });

  describe("speak", () => {
    test("should not speak when disabled", () => {
      voiceEngineInstance.enabled = false;
      voiceEngineInstance.speak("Test message");
      expect(voiceEngineInstance.queue).toHaveLength(0);
    });

    test("should not speak empty text", () => {
      voiceEngineInstance.speak("");
      expect(voiceEngineInstance.queue).toHaveLength(0);
    });

    test("should add message to queue", () => {
      voiceEngineInstance.speak("Test message");
      expect(voiceEngineInstance.queue).toHaveLength(1);
      expect(voiceEngineInstance.queue[0].text).toBe("Test message");
    });

    test("should set default priority", () => {
      voiceEngineInstance.speak("Test message");
      expect(voiceEngineInstance.queue[0].priority).toBe("normal");
    });

    test("should set high priority", () => {
      voiceEngineInstance.speak("Test message", "high");
      expect(voiceEngineInstance.queue[0].priority).toBe("high");
    });

    test("should set compressed flag", () => {
      voiceEngineInstance.speak("Test message", "normal", true);
      expect(voiceEngineInstance.queue[0].compressed).toBe(true);
    });
  });

  describe("compressText", () => {
    test("should not compress when queue is empty", () => {
      voiceEngineInstance.speak("Tiempo simulado: T+10", "normal", true);
      const text = voiceEngineInstance.compressText("Test message");
      expect(text).toBe("Test message");
    });

    test("should compress text when queue has items", () => {
      voiceEngineInstance.queue.push({ text: "Previous message" });
      const compressed = voiceEngineInstance.compressText(
        "Tiempo simulado: T+10 reporta: Atención. Mensaje prioritario."
      );
      expect(compressed).toContain("T ");
      expect(compressed).toContain(": ");
      expect(compressed).not.toContain("Tiempo simulado:");
    });
  });

  describe("toggle", () => {
    test("should toggle enabled state", () => {
      expect(voiceEngineInstance.toggle()).toBe(false);
      expect(voiceEngineInstance.toggle()).toBe(true);
    });

    test("should clear queue when disabled", () => {
      voiceEngineInstance.speak("Message 1");
      voiceEngineInstance.speak("Message 2");
      voiceEngineInstance.toggle();
      expect(voiceEngineInstance.queue).toHaveLength(0);
    });

    test("should cancel speech when disabled", () => {
      voiceEngineInstance.toggle();
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
    });
  });

  describe("clearQueue", () => {
    test("should clear all queued messages", () => {
      voiceEngineInstance.speak("Message 1");
      voiceEngineInstance.speak("Message 2");
      voiceEngineInstance.clearQueue();
      expect(voiceEngineInstance.queue).toHaveLength(0);
    });

    test("should cancel ongoing speech", () => {
      voiceEngineInstance.isSpeaking = true;
      voiceEngineInstance.clearQueue();
      expect(mockSpeechSynthesis.cancel).toHaveBeenCalled();
      expect(voiceEngineInstance.isSpeaking).toBe(false);
    });
  });

  describe("getStatus", () => {
    test("should return status object", () => {
      const status = voiceEngineInstance.getStatus();
      expect(status).toHaveProperty("enabled");
      expect(status).toHaveProperty("isSpeaking");
      expect(status).toHaveProperty("queueLength");
      expect(status).toHaveProperty("pausedByVoice");
    });

    test("should reflect current state", () => {
      voiceEngineInstance.speak("Test");
      const status = voiceEngineInstance.getStatus();
      expect(status.queueLength).toBe(1);
      expect(status.enabled).toBe(true);
    });
  });

  describe("destroy", () => {
    test("should clear interval on destroy", () => {
      voiceEngineInstance.init();
      const clearIntervalSpy = jest.spyOn(global, "clearInterval");
      voiceEngineInstance.destroy();
      expect(clearIntervalSpy).toHaveBeenCalled();
    });
  });

  describe("IMSS_NOMENCLATURE", () => {
    test("should have all required acronyms", () => {
      expect(IMSS_NOMENCLATURE.SMV).toBe("Saldo Masivo de Víctimas");
      expect(IMSS_NOMENCLATURE["SMV-H"]).toBe("Saldo Masivo de Víctimas Hospitalario");
      expect(IMSS_NOMENCLATURE["EVAC-H"]).toBe("Evacuación Hospitalaria");
      expect(IMSS_NOMENCLATURE["SCI-H"]).toBe("Sistema de Comando de Incidentes Hospitalario");
      expect(IMSS_NOMENCLATURE.QBRNE).toBe("Químico, Biológico, Radiológico, Nuclear o Explosivo");
      expect(IMSS_NOMENCLATURE.CVOED).toBe("Coordinación de Vigilancia Epidemiológica y Desastres");
      expect(IMSS_NOMENCLATURE.UCI).toBe("Unidad de Cuidados Intensivos");
    });
  });

  describe("SCIH_PRIORITY_PREFIX", () => {
    test("should have all priority prefixes", () => {
      expect(SCIH_PRIORITY_PREFIX.critico).toBe("Atención. Mensaje prioritario.");
      expect(SCIH_PRIORITY_PREFIX.radio).toBe("Comunicación.");
      expect(SCIH_PRIORITY_PREFIX.nuevo).toBe("Aviso.");
    });
  });

  describe("CHANNEL_NAMES", () => {
    test("should have all channel expansions", () => {
      expect(CHANNEL_NAMES["📻 RADIO INTERNO"]).toBe("Radio interno hospitalario");
      expect(CHANNEL_NAMES["📻 CRUM OFICIAL"]).toBe("Comunicación oficial del CRUM");
      expect(CHANNEL_NAMES["📞 LLAMADA ANÓNIMA"]).toBe("Llamada telefónica anónima");
    });
  });

  describe("expandIMSSAbbreviations", () => {
    test("should expand SMV abbreviation", () => {
      const result = expandIMSSAbbreviations("Confirmamos SMV en estadio");
      expect(result).toContain("Saldo Masivo de Víctimas");
    });

    test("should expand multiple abbreviations", () => {
      const result = expandIMSSAbbreviations("UCI llena. Activar EVAC-H.");
      expect(result).toContain("Unidad de Cuidados Intensivos");
      expect(result).toContain("Evacuación Hospitalaria");
    });

    test("should handle text without abbreviations", () => {
      const result = expandIMSSAbbreviations("Esto es un texto normal.");
      expect(result).toBe("Esto es un texto normal.");
    });
  });

  describe("cleanVoiceText", () => {
    test("should remove emojis", () => {
      const result = cleanVoiceText("Alerta 🔴 emergencia ⚠️");
      expect(result).not.toContain("🔴");
      expect(result).not.toContain("⚠️");
    });

    test("should expand T+ notation", () => {
      const result = cleanVoiceText("T+10 minutos");
      expect(result).toContain("Tiempo más 10 minutos");
    });

    test("should expand math symbols", () => {
      const result = cleanVoiceText("2 + 2 * 3 / 4");
      expect(result).toContain("2 más 2 por 3 sobre 4");
    });

    test("should clean extra spaces", () => {
      const result = cleanVoiceText("Texto    con    espacios");
      expect(result).toBe("Texto con espacios");
    });

    test("should handle empty string", () => {
      const result = cleanVoiceText("");
      expect(result).toBe("");
    });

    test("should handle null input", () => {
      const result = cleanVoiceText(null);
      expect(result).toBe("");
    });
  });

  describe("buildSCIHMessage", () => {
    const mockInjector = {
      t: 10,
      tipo: "critico",
      canal: "📻 RADIO INTERNO",
      emisor: "UCI · Jefe de servicio",
      texto: "UCI llena. Tenemos 3 paros.",
    };

    test("should build message with priority", () => {
      const result = buildSCIHMessage(mockInjector);
      expect(result).toContain("Atención. Mensaje prioritario.");
    });

    test("should include time", () => {
      const result = buildSCIHMessage(mockInjector);
      expect(result).toContain("T+10");
    });

    test("should include channel expansion", () => {
      const result = buildSCIHMessage(mockInjector);
      expect(result).toContain("Radio interno hospitalario");
    });

    test("should include emitter", () => {
      const result = buildSCIHMessage(mockInjector);
      expect(result).toContain("UCI · Jefe de servicio");
    });

    test("should clean and expand text", () => {
      const result = buildSCIHMessage(mockInjector);
      expect(result).toContain("reporta:");
    });
  });

  describe("singleton instance", () => {
    test("should export a singleton voiceEngine instance", () => {
      expect(voiceEngine).toBeInstanceOf(VoiceEngine);
    });
  });
});
