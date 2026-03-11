import "fake-indexeddb/auto";

// Setup localStorage spies para jsdom
const localStorageGetItemSpy = jest.spyOn(Storage.prototype, "getItem");
const localStorageSetItemSpy = jest.spyOn(Storage.prototype, "setItem");
const localStorageRemoveItemSpy = jest.spyOn(Storage.prototype, "removeItem");
const localStorageClearSpy = jest.spyOn(Storage.prototype, "clear");

// Hacer los spies disponibles globalmente para resetear entre tests
global.localStorageSpies = {
  getItem: localStorageGetItemSpy,
  setItem: localStorageSetItemSpy,
  removeItem: localStorageRemoveItemSpy,
  clear: localStorageClearSpy,
};

// Mock IndexedDB
global.indexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
  cmp: jest.fn(),
};
