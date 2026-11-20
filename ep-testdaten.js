"use strict";
(() => {
  const paths = {
    kp: "Vorlagen/Testdaten/KP_Test_PA_2026.pdf",
    pv: "Vorlagen/Testdaten/PV_Test_PA_2026.pdf"
  };
  const targets = { kp: "epKP", pv: "epPV" };
  const names = { kp: "KP_Test_PA_2026.pdf", pv: "PV_Test_PA_2026.pdf" };
  async function validPDF(path) {
    try {
      const response = await fetch(path, { method: "HEAD", cache: "no-store" });
      return response.ok && (response.headers.get("content-type") || "").toLowerCase().includes("pdf");
    } catch { return false; }
  }
  async function loadBoth(button) {
    const original = button.textContent;
    button.disabled = true;
    button.textContent = "Test-PDFs werden geladen …";
    try {
      const files = await Promise.all(["kp", "pv"].map(async type => {
        const response = await fetch(paths[type], { cache: "no-store" });
        if (!response.ok) throw new Error(names[type] + " konnte nicht geladen werden.");
        const data = await response.blob();
        if (!data.size || (await data.slice(0, 5).text()) !== "%PDF-") throw new Error(names[type] + " ist keine gültige PDF.");
        return { type, file: new File([data], names[type], { type: "application/pdf" }) };
      }));
      for (const { type, file } of files) {
        const transfer = new DataTransfer();
        transfer.items.add(file);
        const input = document.getElementById(targets[type]);
        input.files = transfer.files;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
      button.textContent = "Dummy-KP und Dummy-PV geladen";
    } catch (error) {
      button.textContent = "Laden fehlgeschlagen – erneut versuchen";
      const status = document.getElementById("epImportStatus");
      if (status) status.textContent += "\nTestdaten: " + error.message;
    } finally {
      button.disabled = false;
    }
  }
  document.addEventListener("DOMContentLoaded", async () => {
    const container = document.getElementById("epTestPdfs");
    const button = document.getElementById("epLoadTestPDFs");
    if (!container || !button) return;
    const [kpReady, pvReady] = await Promise.all([validPDF(paths.kp), validPDF(paths.pv)]);
    if (!kpReady || !pvReady) return;
    container.hidden = false;
    button.addEventListener("click", () => loadBoth(button));
  });
})();