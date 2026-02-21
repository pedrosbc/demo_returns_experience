import { useState, useEffect } from "react";

const ITEMS = [
  { id: 1, name: "Casaco de Lã Merino", sku: "WC-2024-001", size: "M", color: "Carvão", price: 189.0, image: "🧥" },
  { id: 2, name: "Calças Slim Chino", sku: "PT-2024-042", size: "32/32", color: "Areia", price: 89.0, image: "👖" },
  { id: 3, name: "Camisa Oxford", sku: "SH-2024-017", size: "L", color: "Branco", price: 65.0, image: "👔" },
  { id: 4, name: "Sapatilhas Runner", sku: "SN-2024-098", size: "42", color: "Preto/Branco", price: 134.0, image: "👟" },
];

const RETURN_METHODS = [
  {
    id: "pickup",
    icon: "🚚",
    title: "Recolha em Casa",
    subtitle: "Sem sair de casa",
    detail: "Agende a data que preferir",
    badge: "Grátis",
    badgeColor: "#22c55e",
    slots: ["Amanhã 9h–13h", "Amanhã 14h–18h", "Quinta 9h–13h", "Quinta 14h–18h"],
  },
  {
    id: "carrier",
    icon: "📦",
    title: "Ponto de Entrega CTT",
    subtitle: "Entregue no carrier",
    detail: "Mais de 1.400 locais em Portugal",
    badge: "Grátis",
    badgeColor: "#22c55e",
    locations: [
      { name: "CTT – Avenida Almirante Reis", dist: "0.4 km", hours: "Seg–Sex 9h–19h" },
      { name: "CTT – Praça do Chile", dist: "0.9 km", hours: "Seg–Sex 9h–18h" },
      { name: "Papelaria Central – Intendente", dist: "1.1 km", hours: "Seg–Sáb 9h–20h" },
    ],
  },
  {
    id: "mall",
    icon: "🏬",
    title: "Devolver no Shopping",
    subtitle: "Drop-off em loja parceira",
    detail: "Pontos de devolução em shoppings",
    badge: "Grátis",
    badgeColor: "#22c55e",
    malls: [
      { name: "El Corte Inglés Lisboa", dist: "1.2 km", floor: "Piso 2, Serviço ao Cliente", hours: "10h–22h" },
      { name: "Colombo", dist: "4.8 km", floor: "Piso 0, Loja Parceira", hours: "10h–23h" },
      { name: "Vasco da Gama", dist: "6.1 km", floor: "Piso 1, Centro de Devoluções", hours: "10h–22h" },
    ],
  },
];

const REASONS = ["Tamanho incorreto", "Qualidade insatisfatória", "Artigo diferente do descrito", "Mudei de ideias", "Produto danificado", "Compra duplicada"];

export default function ReturnsFlow() {
  const [step, setStep] = useState(1); // 1: items, 2: method, 3: confirm
  const [selectedItems, setSelectedItems] = useState({});
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [done, setDone] = useState(false);

  const toggleItem = (id) => {
    setSelectedItems((prev) =>
      prev[id] ? Object.fromEntries(Object.entries(prev).filter(([k]) => k != id)) : { ...prev, [id]: { reason: "" } }
    );
  };

  const setReason = (id, reason) => {
    setSelectedItems((prev) => ({ ...prev, [id]: { ...prev[id], reason } }));
  };

  const itemCount = Object.keys(selectedItems).length;
  const allHaveReasons = Object.values(selectedItems).every((v) => v.reason);
  const canProceedStep1 = itemCount > 0 && allHaveReasons;
  const canProceedStep2 =
    selectedMethod &&
    (selectedMethod.id !== "pickup" || selectedSlot) &&
    ((selectedMethod.id !== "carrier" && selectedMethod.id !== "mall") || selectedLocation);

  const totalValue = Object.keys(selectedItems).reduce((acc, id) => {
    const item = ITEMS.find((i) => i.id === Number(id));
    return acc + (item?.price || 0);
  }, 0);

  const steps = ["Artigos", "Método", "Confirmar"];

  if (done) {
    return (
      <div style={styles.page}>
        <div style={styles.successCard}>
          <div style={styles.successIcon}>✓</div>
          <h2 style={styles.successTitle}>Devolução Registada</h2>
          <p style={styles.successSub}>Referência: <strong>RTN-2024-{Math.floor(Math.random() * 90000) + 10000}</strong></p>
          <p style={styles.successDesc}>
            Receberá um e-mail de confirmação com as instruções detalhadas.
            O reembolso de <strong>€{totalValue.toFixed(2)}</strong> será processado em 3–5 dias úteis.
          </p>
          <button style={styles.btnPrimary} onClick={() => { setStep(1); setSelectedItems({}); setSelectedMethod(null); setSelectedSlot(null); setSelectedLocation(null); setDone(false); }}>
            Nova Devolução
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.brand}>NOVA <span style={{ color: "#d4a843" }}>RETURNS</span></div>
          <div style={styles.orderRef}>Encomenda #ORD-20241118-883</div>
        </div>
      </div>

      {/* Stepper */}
      <div style={styles.stepper}>
        {steps.map((s, i) => {
          const num = i + 1;
          const isActive = step === num;
          const isDone = step > num;
          return (
            <div key={s} style={styles.stepItem}>
              <div style={{ ...styles.stepCircle, background: isDone ? "#d4a843" : isActive ? "#1a1a1a" : "#e5e5e5", color: isDone || isActive ? "#fff" : "#999" }}>
                {isDone ? "✓" : num}
              </div>
              <span style={{ ...styles.stepLabel, color: isActive ? "#1a1a1a" : "#999", fontWeight: isActive ? 600 : 400 }}>{s}</span>
              {i < steps.length - 1 && <div style={{ ...styles.stepLine, background: isDone ? "#d4a843" : "#e5e5e5" }} />}
            </div>
          );
        })}
      </div>

      <div style={styles.container}>
        {/* STEP 1 – Item Selection */}
        {step === 1 && (
          <div>
            <h2 style={styles.sectionTitle}>Quais artigos pretende devolver?</h2>
            <p style={styles.sectionSub}>Selecione os artigos e indique o motivo da devolução.</p>
            <div style={styles.itemList}>
              {ITEMS.map((item) => {
                const isSelected = !!selectedItems[item.id];
                return (
                  <div key={item.id} style={{ ...styles.itemCard, ...(isSelected ? styles.itemCardSelected : {}) }} onClick={() => toggleItem(item.id)}>
                    <div style={styles.itemRow}>
                      <div style={styles.itemEmoji}>{item.image}</div>
                      <div style={styles.itemInfo}>
                        <div style={styles.itemName}>{item.name}</div>
                        <div style={styles.itemMeta}>{item.size} · {item.color} · <span style={styles.itemSku}>{item.sku}</span></div>
                        <div style={styles.itemPrice}>€{item.price.toFixed(2)}</div>
                      </div>
                      <div style={{ ...styles.checkbox, ...(isSelected ? styles.checkboxSelected : {}) }}>
                        {isSelected && "✓"}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={styles.reasonRow} onClick={(e) => e.stopPropagation()}>
                        <label style={styles.reasonLabel}>Motivo da devolução</label>
                        <select
                          style={styles.select}
                          value={selectedItems[item.id]?.reason || ""}
                          onChange={(e) => setReason(item.id, e.target.value)}
                        >
                          <option value="">Selecione um motivo…</option>
                          {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={styles.footer}>
              {itemCount > 0 && (
                <div style={styles.summary}>
                  {itemCount} artigo{itemCount > 1 ? "s" : ""} · €{totalValue.toFixed(2)} a reembolsar
                </div>
              )}
              <button style={{ ...styles.btnPrimary, opacity: canProceedStep1 ? 1 : 0.4 }} disabled={!canProceedStep1} onClick={() => setStep(2)}>
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 – Return Method */}
        {step === 2 && (
          <div>
            <h2 style={styles.sectionTitle}>Como prefere devolver?</h2>
            <p style={styles.sectionSub}>Escolha o método mais conveniente para si.</p>
            <div style={styles.methodList}>
              {RETURN_METHODS.map((method) => {
                const isSelected = selectedMethod?.id === method.id;
                return (
                  <div key={method.id} style={{ ...styles.methodCard, ...(isSelected ? styles.methodCardSelected : {}) }} onClick={() => { setSelectedMethod(method); setSelectedSlot(null); setSelectedLocation(null); }}>
                    <div style={styles.methodHeader}>
                      <span style={styles.methodIcon}>{method.icon}</span>
                      <div style={styles.methodText}>
                        <div style={styles.methodTitle}>{method.title}</div>
                        <div style={styles.methodSubtitle}>{method.subtitle}</div>
                      </div>
                      <span style={{ ...styles.badge, background: method.badgeColor }}>{method.badge}</span>
                      <div style={{ ...styles.radioCircle, ...(isSelected ? styles.radioSelected : {}) }} />
                    </div>
                    <div style={styles.methodDetail}>{method.detail}</div>

                    {/* Pickup slots */}
                    {isSelected && method.id === "pickup" && (
                      <div style={styles.subSection} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.subTitle}>Escolha o horário</div>
                        <div style={styles.slotGrid}>
                          {method.slots.map((slot) => (
                            <div key={slot} style={{ ...styles.slot, ...(selectedSlot === slot ? styles.slotSelected : {}) }} onClick={() => setSelectedSlot(slot)}>
                              {slot}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Carrier locations */}
                    {isSelected && method.id === "carrier" && (
                      <div style={styles.subSection} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.subTitle}>Pontos mais próximos</div>
                        {method.locations.map((loc) => (
                          <div key={loc.name} style={{ ...styles.locationRow, ...(selectedLocation?.name === loc.name ? styles.locationSelected : {}) }} onClick={() => setSelectedLocation(loc)}>
                            <div>
                              <div style={styles.locName}>{loc.name}</div>
                              <div style={styles.locHours}>{loc.hours}</div>
                            </div>
                            <div style={styles.distBadge}>📍 {loc.dist}</div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Mall locations */}
                    {isSelected && method.id === "mall" && (
                      <div style={styles.subSection} onClick={(e) => e.stopPropagation()}>
                        <div style={styles.subTitle}>Shoppings mais próximos</div>
                        {method.malls.map((mall) => (
                          <div key={mall.name} style={{ ...styles.mallRow, ...(selectedLocation?.name === mall.name ? styles.locationSelected : {}) }} onClick={() => setSelectedLocation(mall)}>
                            <div style={styles.mallLeft}>
                              <div style={styles.mallName}>{mall.name}</div>
                              <div style={styles.mallFloor}>{mall.floor}</div>
                              <div style={styles.locHours}>{mall.hours}</div>
                            </div>
                            <div style={styles.mallRight}>
                              <div style={styles.distBadge}>📍 {mall.dist}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            <div style={styles.footer}>
              <button style={styles.btnSecondary} onClick={() => setStep(1)}>← Voltar</button>
              <button style={{ ...styles.btnPrimary, opacity: canProceedStep2 ? 1 : 0.4 }} disabled={!canProceedStep2} onClick={() => setStep(3)}>
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 – Confirm */}
        {step === 3 && (
          <div>
            <h2 style={styles.sectionTitle}>Confirme a sua devolução</h2>
            <p style={styles.sectionSub}>Reveja os detalhes antes de submeter.</p>

            <div style={styles.confirmCard}>
              <div style={styles.confirmSection}>
                <div style={styles.confirmLabel}>ARTIGOS A DEVOLVER</div>
                {Object.keys(selectedItems).map((id) => {
                  const item = ITEMS.find((i) => i.id === Number(id));
                  return (
                    <div key={id} style={styles.confirmItem}>
                      <span style={{ fontSize: 20 }}>{item.image}</span>
                      <div style={{ flex: 1 }}>
                        <div style={styles.confirmItemName}>{item.name}</div>
                        <div style={styles.confirmItemMeta}>{selectedItems[id].reason}</div>
                      </div>
                      <div style={styles.confirmPrice}>€{item.price.toFixed(2)}</div>
                    </div>
                  );
                })}
              </div>

              <div style={styles.divider} />

              <div style={styles.confirmSection}>
                <div style={styles.confirmLabel}>MÉTODO DE DEVOLUÇÃO</div>
                <div style={styles.confirmMethod}>
                  <span style={{ fontSize: 24 }}>{selectedMethod.icon}</span>
                  <div>
                    <div style={styles.confirmItemName}>{selectedMethod.title}</div>
                    {selectedSlot && <div style={styles.confirmItemMeta}>{selectedSlot}</div>}
                    {selectedLocation && <div style={styles.confirmItemMeta}>{selectedLocation.name} · {selectedLocation.dist}</div>}
                  </div>
                </div>
              </div>

              <div style={styles.divider} />

              <div style={styles.refundRow}>
                <div>
                  <div style={styles.refundLabel}>Reembolso estimado</div>
                  <div style={styles.refundNote}>3–5 dias úteis após receção</div>
                </div>
                <div style={styles.refundAmount}>€{totalValue.toFixed(2)}</div>
              </div>
            </div>

            <div style={styles.footer}>
              <button style={styles.btnSecondary} onClick={() => setStep(2)}>← Voltar</button>
              <button style={styles.btnPrimary} onClick={() => setDone(true)}>
                Confirmar Devolução
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8f6f1", fontFamily: "'Georgia', serif", color: "#1a1a1a" },
  header: { background: "#1a1a1a", padding: "16px 24px" },
  headerInner: { maxWidth: 680, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center" },
  brand: { color: "#fff", fontSize: 18, fontWeight: 700, letterSpacing: 3 },
  orderRef: { color: "#888", fontSize: 12, letterSpacing: 1 },
  stepper: { display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 16px", gap: 0 },
  stepItem: { display: "flex", alignItems: "center", gap: 8 },
  stepCircle: { width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 600, fontFamily: "monospace" },
  stepLabel: { fontSize: 13, letterSpacing: 0.5, minWidth: 60, textAlign: "center" },
  stepLine: { width: 48, height: 2, margin: "0 8px" },
  container: { maxWidth: 680, margin: "0 auto", padding: "0 16px 48px" },
  sectionTitle: { fontSize: 26, fontWeight: 700, margin: "0 0 6px", letterSpacing: -0.5 },
  sectionSub: { color: "#666", fontSize: 15, margin: "0 0 24px" },
  itemList: { display: "flex", flexDirection: "column", gap: 12 },
  itemCard: { background: "#fff", border: "2px solid #e5e5e5", borderRadius: 12, padding: 16, cursor: "pointer", transition: "all .15s" },
  itemCardSelected: { borderColor: "#d4a843", background: "#fffbf0" },
  itemRow: { display: "flex", alignItems: "center", gap: 14 },
  itemEmoji: { fontSize: 36, width: 48, textAlign: "center", flexShrink: 0 },
  itemInfo: { flex: 1 },
  itemName: { fontWeight: 600, fontSize: 15, marginBottom: 2 },
  itemMeta: { fontSize: 13, color: "#777" },
  itemSku: { fontFamily: "monospace", fontSize: 11 },
  itemPrice: { fontWeight: 700, fontSize: 15, marginTop: 4, color: "#1a1a1a" },
  checkbox: { width: 24, height: 24, borderRadius: 6, border: "2px solid #ccc", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  checkboxSelected: { background: "#d4a843", borderColor: "#d4a843", color: "#fff" },
  reasonRow: { marginTop: 14, paddingTop: 14, borderTop: "1px solid #f0e8d0" },
  reasonLabel: { display: "block", fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#999", marginBottom: 6, textTransform: "uppercase" },
  select: { width: "100%", padding: "10px 12px", border: "1.5px solid #e5e5e5", borderRadius: 8, fontSize: 14, background: "#fff", color: "#1a1a1a", outline: "none", fontFamily: "'Georgia', serif" },
  methodList: { display: "flex", flexDirection: "column", gap: 12 },
  methodCard: { background: "#fff", border: "2px solid #e5e5e5", borderRadius: 12, padding: 18, cursor: "pointer", transition: "all .15s" },
  methodCardSelected: { borderColor: "#d4a843", background: "#fffbf0" },
  methodHeader: { display: "flex", alignItems: "center", gap: 12 },
  methodIcon: { fontSize: 28, flexShrink: 0 },
  methodText: { flex: 1 },
  methodTitle: { fontWeight: 700, fontSize: 16 },
  methodSubtitle: { fontSize: 13, color: "#777" },
  badge: { fontSize: 11, fontWeight: 700, color: "#fff", padding: "3px 8px", borderRadius: 20, letterSpacing: 0.5 },
  radioCircle: { width: 20, height: 20, borderRadius: "50%", border: "2px solid #ccc", flexShrink: 0 },
  radioSelected: { borderColor: "#d4a843", background: "#d4a843" },
  methodDetail: { fontSize: 13, color: "#999", marginTop: 6, paddingLeft: 40 },
  subSection: { marginTop: 16, paddingTop: 16, borderTop: "1px solid #f0e8d0" },
  subTitle: { fontSize: 11, fontWeight: 600, letterSpacing: 1, color: "#999", textTransform: "uppercase", marginBottom: 10 },
  slotGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  slot: { padding: "10px 12px", border: "1.5px solid #e5e5e5", borderRadius: 8, fontSize: 13, cursor: "pointer", textAlign: "center", transition: "all .1s" },
  slotSelected: { borderColor: "#d4a843", background: "#d4a843", color: "#fff", fontWeight: 600 },
  locationRow: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", border: "1.5px solid #e5e5e5", borderRadius: 8, marginBottom: 8, cursor: "pointer", transition: "all .1s" },
  mallRow: { display: "flex", justifyContent: "space-between", padding: "12px", border: "1.5px solid #e5e5e5", borderRadius: 8, marginBottom: 8, cursor: "pointer", transition: "all .1s" },
  locationSelected: { borderColor: "#d4a843", background: "#fffbf0" },
  locName: { fontWeight: 600, fontSize: 14 },
  mallName: { fontWeight: 600, fontSize: 14 },
  mallFloor: { fontSize: 12, color: "#555", marginTop: 2 },
  mallLeft: { flex: 1 },
  mallRight: { display: "flex", alignItems: "center" },
  locHours: { fontSize: 12, color: "#888", marginTop: 2 },
  distBadge: { fontSize: 12, fontWeight: 600, color: "#555", background: "#f0f0f0", padding: "4px 10px", borderRadius: 20, whiteSpace: "nowrap" },
  footer: { display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 12, marginTop: 28, paddingTop: 20, borderTop: "1px solid #e5e5e5" },
  summary: { flex: 1, fontSize: 14, color: "#666" },
  btnPrimary: { background: "#1a1a1a", color: "#fff", border: "none", padding: "13px 28px", borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5, transition: "opacity .15s" },
  btnSecondary: { background: "transparent", color: "#555", border: "1.5px solid #ccc", padding: "12px 20px", borderRadius: 8, fontSize: 14, cursor: "pointer" },
  confirmCard: { background: "#fff", border: "1.5px solid #e5e5e5", borderRadius: 14, overflow: "hidden" },
  confirmSection: { padding: "20px 24px" },
  confirmLabel: { fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: "#aaa", textTransform: "uppercase", marginBottom: 14 },
  confirmItem: { display: "flex", alignItems: "center", gap: 12, marginBottom: 10 },
  confirmItemName: { fontWeight: 600, fontSize: 14 },
  confirmItemMeta: { fontSize: 12, color: "#777" },
  confirmPrice: { fontWeight: 700, fontSize: 14 },
  confirmMethod: { display: "flex", alignItems: "center", gap: 14 },
  divider: { height: 1, background: "#f0f0f0" },
  refundRow: { padding: "20px 24px", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#fafaf7" },
  refundLabel: { fontWeight: 700, fontSize: 15 },
  refundNote: { fontSize: 12, color: "#999", marginTop: 2 },
  refundAmount: { fontSize: 28, fontWeight: 700, color: "#1a1a1a" },
  successCard: { maxWidth: 480, margin: "80px auto", background: "#fff", borderRadius: 16, padding: 48, textAlign: "center", boxShadow: "0 4px 40px rgba(0,0,0,.08)" },
  successIcon: { width: 64, height: 64, background: "#1a1a1a", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, color: "#d4a843", margin: "0 auto 20px", fontWeight: 700 },
  successTitle: { fontSize: 24, fontWeight: 700, margin: "0 0 8px" },
  successSub: { fontSize: 14, color: "#666", margin: "0 0 16px" },
  successDesc: { fontSize: 14, color: "#555", lineHeight: 1.7, margin: "0 0 28px" },
};
