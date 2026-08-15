// api/sap-toll-hook.js - Peaje Privado V24
// Cobra 1 crédito por cada uso del notario. 100% interno.

let CREDITOS = {}; // En prod usa DB real (Vercel KV, Supabase)

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method!== 'POST') {
    return res.status(405).json({ error: 'Usa POST' });
  }

  const { clienteId, selloId } = req.body || {};

  if (!clienteId) {
    return res.status(400).json({ error: 'Falta clienteId' });
  }

  // Inicializa si no existe (demo: 10 créditos gratis)
  if (!CREDITOS[clienteId]) {
    CREDITOS[clienteId] = 10;
  }

  // Verifica saldo
  if (CREDITOS[clienteId] <= 0) {
    return res.status(402).json({
      error: 'Sin créditos',
      mensaje: 'Recarga en Valdovinos Vault para seguir sellando',
      clienteId
    });
  }

  // Cobra peaje
  CREDITOS[clienteId] -= 1;

  const ticket = {
    ticketId: `TOLL-${Date.now()}`,
    clienteId,
    selloId: selloId || 'N/A',
    cobrado: 1,
    saldoRestante: CREDITOS[clienteId],
    timestamp: new Date().toISOString(),
    estado: 'PEAJE-COBRADO-OK',
    nota: 'Peaje privado interno V24. No es pago oficial SAT/SAP/aduana.'
  };

  return res.status(200).json(ticket);
};
