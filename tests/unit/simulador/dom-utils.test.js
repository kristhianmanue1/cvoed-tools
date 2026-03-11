/**
 * Unit Tests for DOM Utilities
 * Hospital de Nunca Jamás - FIFA 2026
 */

import {
  showToast,
  getElement,
  setText,
  toggleClass,
  addClass,
  removeClass,
  setAttribute,
  hide,
  show,
  queryAll,
  query,
  formatTime,
  calculatePercentage,
  updateClock,
  updateHeaderStat,
  updateSMVBanner,
  resetActionButtons,
  updateSVGText,
  switchTab,
  closeAllModals,
  setupKeyboardListener,
} from "@/src/simulador/js/utils/dom-utils.js";

// Mock DOM
let mockAddEventListener;

beforeEach(() => {
  mockAddEventListener = jest.fn();
  global.document = {
    getElementById: jest.fn(),
    querySelector: jest.fn(),
    querySelectorAll: jest.fn(),
    createElement: jest.fn(),
    addEventListener: mockAddEventListener,
  };

  global.console = {
    warn: jest.fn(),
    log: jest.fn(),
    error: jest.fn(),
  };
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("getElement", () => {
  test("should return element when found", () => {
    const mockElement = { id: "test" };
    document.getElementById.mockReturnValue(mockElement);

    const result = getElement("test");

    expect(result).toBe(mockElement);
    expect(document.getElementById).toHaveBeenCalledWith("test");
  });

  test("should return null and warn when not found", () => {
    document.getElementById.mockReturnValue(null);

    const result = getElement("nonexistent");

    expect(result).toBeNull();
    expect(console.warn).toHaveBeenCalledWith("[DOM] Element not found: nonexistent");
  });

  test("should return null when document is undefined", () => {
    const originalDocument = global.document;
    // @ts-ignore
    delete global.document;

    const result = getElement("test");

    expect(result).toBeNull();

    global.document = originalDocument;
  });
});

describe("setText", () => {
  test("should set text content of element", () => {
    const mockElement = { textContent: "" };
    document.getElementById.mockReturnValue(mockElement);

    const result = setText("test-id", "Hello World");

    expect(result).toBe(true);
    expect(mockElement.textContent).toBe("Hello World");
  });

  test("should return false when element not found", () => {
    document.getElementById.mockReturnValue(null);

    const result = setText("nonexistent", "text");

    expect(result).toBe(false);
  });
});

describe("showToast", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test("should show toast with message", () => {
    const mockToast = {
      textContent: "",
      classList: { add: jest.fn(), remove: jest.fn() },
      _timeout: null,
    };
    document.getElementById.mockReturnValue(mockToast);

    showToast("Test message");

    expect(mockToast.textContent).toBe("Test message");
    expect(mockToast.classList.add).toHaveBeenCalledWith("visible");
  });

  test("should clear existing timeout", () => {
    const mockTimeout = setTimeout(() => {}, 1000);
    const mockToast = {
      textContent: "",
      classList: { add: jest.fn(), remove: jest.fn() },
      _timeout: mockTimeout,
    };
    document.getElementById.mockReturnValue(mockToast);

    const clearTimeoutSpy = jest.spyOn(global, "clearTimeout");

    showToast("New message");

    expect(clearTimeoutSpy).toHaveBeenCalledWith(mockTimeout);
  });

  test("should set new timeout to hide toast", () => {
    const mockToast = {
      textContent: "",
      classList: { add: jest.fn(), remove: jest.fn() },
      _timeout: null,
    };
    document.getElementById.mockReturnValue(mockToast);

    showToast("Test message", 3000);

    expect(mockToast._timeout).toBeTruthy();

    jest.advanceTimersByTime(3000);

    expect(mockToast.classList.remove).toHaveBeenCalledWith("visible");
  });

  test("should return early when toast element not found", () => {
    document.getElementById.mockReturnValue(null);

    expect(() => showToast("message")).not.toThrow();
  });

  test("should return early when document is undefined", () => {
    const originalDocument = global.document;
    // @ts-ignore
    delete global.document;

    expect(() => showToast("message")).not.toThrow();

    global.document = originalDocument;
  });
});

describe("toggleClass", () => {
  test("should toggle class on element", () => {
    const mockElement = { classList: { toggle: jest.fn() } };
    document.getElementById.mockReturnValue(mockElement);

    const result = toggleClass("test-id", "active", true);

    expect(result).toBe(true);
    expect(mockElement.classList.toggle).toHaveBeenCalledWith("active", true);
  });

  test("should toggle class without force parameter", () => {
    const mockElement = { classList: { toggle: jest.fn() } };
    document.getElementById.mockReturnValue(mockElement);

    toggleClass("test-id", "active");

    expect(mockElement.classList.toggle).toHaveBeenCalledWith("active", undefined);
  });

  test("should return false when element not found", () => {
    document.getElementById.mockReturnValue(null);

    const result = toggleClass("nonexistent", "active");

    expect(result).toBe(false);
  });
});

describe("addClass", () => {
  test("should add class to element", () => {
    const mockElement = { classList: { add: jest.fn() } };
    document.getElementById.mockReturnValue(mockElement);

    const result = addClass("test-id", "active");

    expect(result).toBe(true);
    expect(mockElement.classList.add).toHaveBeenCalledWith("active");
  });

  test("should return false when element not found", () => {
    document.getElementById.mockReturnValue(null);

    const result = addClass("nonexistent", "active");

    expect(result).toBe(false);
  });
});

describe("removeClass", () => {
  test("should remove class from element", () => {
    const mockElement = { classList: { remove: jest.fn() } };
    document.getElementById.mockReturnValue(mockElement);

    const result = removeClass("test-id", "active");

    expect(result).toBe(true);
    expect(mockElement.classList.remove).toHaveBeenCalledWith("active");
  });

  test("should return false when element not found", () => {
    document.getElementById.mockReturnValue(null);

    const result = removeClass("nonexistent", "active");

    expect(result).toBe(false);
  });
});

describe("setAttribute", () => {
  test("should set attribute on element", () => {
    const mockElement = { setAttribute: jest.fn() };
    document.getElementById.mockReturnValue(mockElement);

    const result = setAttribute("test-id", "aria-label", "Test");

    expect(result).toBe(true);
    expect(mockElement.setAttribute).toHaveBeenCalledWith("aria-label", "Test");
  });

  test("should return false when element not found", () => {
    document.getElementById.mockReturnValue(null);

    const result = setAttribute("nonexistent", "attr", "value");

    expect(result).toBe(false);
  });
});

describe("hide", () => {
  test("should add hidden class to element", () => {
    const mockElement = { classList: { add: jest.fn() } };
    document.getElementById.mockReturnValue(mockElement);

    const result = hide("test-id");

    expect(result).toBe(true);
    expect(mockElement.classList.add).toHaveBeenCalledWith("hidden");
  });
});

describe("show", () => {
  test("should remove hidden class from element", () => {
    const mockElement = { classList: { remove: jest.fn() } };
    document.getElementById.mockReturnValue(mockElement);

    const result = show("test-id");

    expect(result).toBe(true);
    expect(mockElement.classList.remove).toHaveBeenCalledWith("hidden");
  });
});

describe("queryAll", () => {
  test("should query all elements by selector", () => {
    const mockElements = [{}, {}];
    document.querySelectorAll.mockReturnValue(mockElements);

    const result = queryAll(".test-class");

    expect(result).toEqual(mockElements);
    expect(document.querySelectorAll).toHaveBeenCalledWith(".test-class");
  });

  test("should query within parent element", () => {
    const mockParent = { querySelectorAll: jest.fn() };
    const mockElements = [{}];
    mockParent.querySelectorAll.mockReturnValue(mockElements);

    const result = queryAll(".test-class", mockParent);

    expect(result).toEqual(mockElements);
    expect(mockParent.querySelectorAll).toHaveBeenCalledWith(".test-class");
  });

  test("should return empty array when document is undefined", () => {
    const originalDocument = global.document;
    // @ts-ignore
    delete global.document;

    const result = queryAll(".test");

    expect(result).toEqual([]);

    global.document = originalDocument;
  });
});

describe("query", () => {
  test("should query single element by selector", () => {
    const mockElement = { id: "test" };
    document.querySelector.mockReturnValue(mockElement);

    const result = query("#test-id");

    expect(result).toBe(mockElement);
    expect(document.querySelector).toHaveBeenCalledWith("#test-id");
  });

  test("should query within parent element", () => {
    const mockParent = { querySelector: jest.fn() };
    const mockElement = { id: "test" };
    mockParent.querySelector.mockReturnValue(mockElement);

    const result = query(".test-class", mockParent);

    expect(result).toBe(mockElement);
    expect(mockParent.querySelector).toHaveBeenCalledWith(".test-class");
  });

  test("should return null when document is undefined", () => {
    const originalDocument = global.document;
    // @ts-ignore
    delete global.document;

    const result = query(".test");

    expect(result).toBeNull();

    global.document = originalDocument;
  });
});

describe("formatTime", () => {
  test("should format time as T+MM", () => {
    expect(formatTime(0)).toBe("T+00");
    expect(formatTime(5)).toBe("T+05");
    expect(formatTime(10)).toBe("T+10");
    expect(formatTime(30)).toBe("T+30");
    expect(formatTime(99)).toBe("T+99");
  });

  test("should pad single digit minutes", () => {
    expect(formatTime(1)).toBe("T+01");
    expect(formatTime(9)).toBe("T+09");
  });
});

describe("calculatePercentage", () => {
  test("should calculate percentage correctly", () => {
    expect(calculatePercentage(50, 100)).toBe(50);
    expect(calculatePercentage(25, 100)).toBe(25);
    expect(calculatePercentage(75, 100)).toBe(75);
    expect(calculatePercentage(1, 3)).toBe(33);
  });

  test("should return 0 when total is 0", () => {
    expect(calculatePercentage(50, 0)).toBe(0);
  });

  test("should return 0 when value is 0", () => {
    expect(calculatePercentage(0, 100)).toBe(0);
  });

  test("should return 100 for full value", () => {
    expect(calculatePercentage(100, 100)).toBe(100);
  });
});

describe("updateClock", () => {
  test("should update clock display", () => {
    const mockElement = {
      textContent: "",
      classList: { toggle: jest.fn() },
    };
    document.getElementById.mockReturnValue(mockElement);

    updateClock(25);

    expect(mockElement.textContent).toBe("T+25");
    expect(mockElement.classList.toggle).toHaveBeenCalledWith("urgent", false);
  });

  test("should add urgent class when time > 30", () => {
    const mockElement = {
      textContent: "",
      classList: { toggle: jest.fn() },
    };
    document.getElementById.mockReturnValue(mockElement);

    updateClock(35);

    expect(mockElement.classList.toggle).toHaveBeenCalledWith("urgent", true);
  });

  test("should handle non-existent clock element", () => {
    document.getElementById.mockReturnValue(null);

    expect(() => updateClock(25)).not.toThrow();
  });
});

describe("updateHeaderStat", () => {
  test("should update header stat element", () => {
    const mockElement = { textContent: "" };
    document.getElementById.mockReturnValue(mockElement);

    updateHeaderStat("stat-id", "42");

    expect(mockElement.textContent).toBe("42");
  });

  test("should handle non-existent element", () => {
    document.getElementById.mockReturnValue(null);

    expect(() => updateHeaderStat("nonexistent", "42")).not.toThrow();
  });
});

describe("updateSMVBanner", () => {
  test("should update SMV banner for Grade I", () => {
    const mockBanner = { className: "" };
    const mockLabel = { textContent: "" };
    document.getElementById.mockImplementation((id) => {
      if (id === "smv-banner") return mockBanner;
      if (id === "smv-label") return mockLabel;
      return null;
    });

    updateSMVBanner(1, 15);

    expect(mockBanner.className).toBe("grado1");
    expect(mockLabel.textContent).toBe("CÓDIGO SMV ACTIVADO · GRADO I · T+15");
  });

  test("should update SMV banner for Grade II", () => {
    const mockBanner = { className: "" };
    const mockLabel = { textContent: "" };
    document.getElementById.mockImplementation((id) => {
      if (id === "smv-banner") return mockBanner;
      if (id === "smv-label") return mockLabel;
      return null;
    });

    updateSMVBanner(2, 20);

    expect(mockBanner.className).toBe("grado2");
    expect(mockLabel.textContent).toBe("CÓDIGO SMV ACTIVADO · GRADO II · T+20");
  });

  test("should update SMV banner for Grade III", () => {
    const mockBanner = { className: "" };
    const mockLabel = { textContent: "" };
    document.getElementById.mockImplementation((id) => {
      if (id === "smv-banner") return mockBanner;
      if (id === "smv-label") return mockLabel;
      return null;
    });

    updateSMVBanner(3, 25);

    expect(mockBanner.className).toBe("grado3");
    expect(mockLabel.textContent).toBe("CÓDIGO SMV ACTIVADO · GRADO III · T+25");
  });
});

describe("resetActionButtons", () => {
  test("should reset all action buttons", () => {
    const mockButtons = {
      "btn-1": { classList: { remove: jest.fn() }, textContent: "" },
      "btn-2": { classList: { remove: jest.fn() }, textContent: "" },
    };

    document.getElementById.mockImplementation((id) => mockButtons[id]);

    resetActionButtons({
      "btn-1": "Button 1",
      "btn-2": "Button 2",
    });

    expect(mockButtons["btn-1"].classList.remove).toHaveBeenCalledWith("active");
    expect(mockButtons["btn-1"].textContent).toBe("Button 1");
    expect(mockButtons["btn-2"].classList.remove).toHaveBeenCalledWith("active");
    expect(mockButtons["btn-2"].textContent).toBe("Button 2");
  });
});

describe("updateSVGText", () => {
  test("should update SVG text element", () => {
    const mockElement = {
      textContent: "",
      setAttribute: jest.fn(),
    };
    document.getElementById.mockReturnValue(mockElement);

    updateSVGText("svg-id", "New Text", "#FF0000");

    expect(mockElement.textContent).toBe("New Text");
    expect(mockElement.setAttribute).toHaveBeenCalledWith("fill", "#FF0000");
  });

  test("should update SVG text without fill color", () => {
    const mockElement = {
      textContent: "",
      setAttribute: jest.fn(),
    };
    document.getElementById.mockReturnValue(mockElement);

    updateSVGText("svg-id", "New Text");

    expect(mockElement.textContent).toBe("New Text");
    expect(mockElement.setAttribute).not.toHaveBeenCalled();
  });
});

describe("switchTab", () => {
  test("should switch to inyectores tab", () => {
    const mockTabs = [
      { classList: { remove: jest.fn(), add: jest.fn() } },
      { classList: { remove: jest.fn() } },
    ];
    const mockPanels = [
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn(), add: jest.fn() } },
    ];

    document.querySelectorAll.mockImplementation((selector) => {
      if (selector.includes("tab")) return mockTabs;
      if (selector.includes("panel")) return mockPanels;
      return [];
    });
    document.querySelector.mockReturnValue(mockTabs[0]);
    document.getElementById.mockReturnValue(mockPanels[1]);

    switchTab("inyectores");

    expect(mockTabs[0].classList.remove).toHaveBeenCalledWith("active");
    expect(mockTabs[0].classList.add).toHaveBeenCalledWith("active");
    expect(mockPanels[1].classList.add).toHaveBeenCalledWith("active");
  });
});

describe("closeAllModals", () => {
  test("should close all modals", () => {
    const mockModals = [
      { classList: { remove: jest.fn() } },
      { classList: { remove: jest.fn() } },
    ];
    document.querySelectorAll.mockReturnValue(mockModals);

    closeAllModals();

    mockModals.forEach((modal) => {
      expect(modal.classList.remove).toHaveBeenCalledWith("open");
    });
  });
});

describe("setupKeyboardListener", () => {
  let localMockAddEventListener;

  beforeEach(() => {
    // Create a fresh mock for these tests
    localMockAddEventListener = jest.fn();
    global.document.addEventListener = localMockAddEventListener;
  });

  test("should setup keyboard listener for Escape key", () => {
    const callback = jest.fn();

    setupKeyboardListener(callback);

    expect(localMockAddEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
  });

  test("should call callback on Escape key", () => {
    const callback = jest.fn();

    setupKeyboardListener(callback);

    // Get the event handler function (first call to addEventListener)
    const eventHandler = localMockAddEventListener.mock.calls[0][1];

    // Trigger the event with Escape key
    eventHandler({ key: "Escape" });

    expect(callback).toHaveBeenCalled();
  });

  test("should not call callback on other keys", () => {
    const callback = jest.fn();

    setupKeyboardListener(callback);

    // Get the event handler function (first call to addEventListener)
    const eventHandler = localMockAddEventListener.mock.calls[0][1];

    // Trigger with Enter key
    eventHandler({ key: "Enter" });

    expect(callback).not.toHaveBeenCalled();
  });
});
