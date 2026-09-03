// api/server.js - KRONOS V24 PARA VERCEL
// Autor: Marco Antonio Rojas Valdovinos - ID 7225862335

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();

    const { path } = req.query;
    const crypto = require('crypto');

    // =============================================
    // 1. CERTIFICADO OFICIAL (GET)
    //    /api/server?path=certificado&cliente=BEREL
    // =============================================
    if (req.method === 'GET' && path === 'certificado') {
        const cliente = req.query.cliente || 'BEREL';
        const referencia = req.query.referencia || 'LOTE-001';
        const folio = `KISS-OF-${Date.now()}`;
        const fecha = new Date().toLocaleString('es-MX', { timeZone: 'America/Mexico_City' });
        const hash = crypto.createHash('sha256')
            .update(folio + cliente + '2607146379465')
            .digest('hex')
            .toUpperCase();

        const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>Certificado KRONOS</title></head>
<body style="font-family:Georgia;border:12px double #000;padding:40px;max-width:800px;margin:40px auto;">
    <center><h1>SISTEMA KRONOS V16</h1>
    <p>ARQUITECTO: MARCO ANTONIO ROJAS VALDOVINOS<br/>ID MAESTRO: 2608096674952</p>
    <hr/><h2>CERTIFICADO OFICIAL DE INMUNIDAD Y PROCEDENCIA</h2></center>
    <br/><b>FOLIO OFICIAL:</b> ${folio}<br/>
    <b>CLIENTE:</b> ${cliente}<br/><b>REFERENCIA:</b> ${referencia}<br/>
    <b>FECHA OFICIAL CDMX:</b> ${fecha}<br/>
    <b>ESTADO:</b> AUDITADO NIVEL 1 FOUNDATION — APROBADO<br/><br/>
    <b>HASH SHA-256:</b><br/>
    <span style="font-family:monospace;font-size:11px;word-break:break-all;">${hash}</span>
    <br/><br/><center>
    <div style="border:2px solid #000;width:260px;padding:20px;">SELLO DIGITAL V24<br/>VALDOVINOS CORTEX<br/><br/>FIRMA</div>
    <p style="font-size:9px;margin-top:30px;">Certificado Privado de Trazabilidad. No es documento SAT, aduanal o notarial.<br/>Validez privada y contractual. Alteración invalida el HASH.</p>
    </center>
</body></html>`;
        res.setHeader('Content-Type', 'text/html');
        return res.send(html);
    }

    // =============================================
    // 2. VERIFICAR FOLIO (GET)
    //    /api/server?path=verificar&folio=KRMV-KRONOS-0000001
    // =============================================
    if (req.method === 'GET' && path === 'verificar') {
        const folio = req.query.folio || '';
        // Registro demo (puedes expandirlo)
        const registry = [
            { folio: 'KRMV-KRONOS-0000001', hash: 'KR-7225862335-2026-B5', titular: 'Marco Valdovinos', caducidad: '2027-08-13', estado: 0 }
        ];
        const item = registry.find(r => r.folio === folio);
        if (!item) return res.json({ existe: false, folio });
        return res.json({ existe: true, folio, estado: item.estado, titular: item.titular, caducidad: item.caducidad, hash: item.hash });
    }

    // =============================================
    // 3. NOTARIO (POST) - Sellar payloads
    //    POST /api/server?path=notario
    // =============================================
    if (req.method === 'POST' && path === 'notario') {
        const { payload } = req.body || {};
        if (!payload) return res.status(400).json({ error: 'Falta payload' });
        const hash = crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex');
        return res.json({
            selloId: `V24-${Date.now()}-${hash.slice(0,8).toUpperCase()}`,
            timestamp: new Date().toISOString(),
            hashContenido: hash,
            estado: 'SELLADO-PRIVADO-OK'
        });
    }

    // =============================================
    // 4. PEAJE (POST) - Cobro interno
    //    POST /api/server?path=peaje
    // =============================================
    if (req.method === 'POST' && path === 'peaje') {
        const { clienteId } = req.body || {};
        if (!clienteId) return res.status(400).json({ error: 'Falta clienteId' });
        return res.json({
            ticketId: `TOLL-${Date.now()}`,
            cobrado: 1,
            estado: 'PEAJE-VALIDADO',
            nota: 'Peaje privado interno V24.'
        });
    }

    return res.status(404).json({ error: 'Ruta no encontrada' });
};