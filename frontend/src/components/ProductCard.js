/**
 * @fileoverview Componentă ProductCard
 * @module components/ProductCard
 */

import React from 'react';

/**
 * Calculează statusul de expirare
 */
const calculeazaStatus = (dataExpirare) => {
    if (!dataExpirare) return { clasa: 'ok', text: 'Fără dată' };
    const azi = new Date();
    const expira = new Date(dataExpirare);
    const diferentaTimp = expira - azi;
    const diferentaZile = Math.ceil(diferentaTimp / (1000 * 60 * 60 * 24));
    if (diferentaZile < 0) return { clasa: 'expirat', text: 'EXPIRAT' };
    if (diferentaZile <= 3) return { clasa: 'atentie-mare', text: 'Expira curând' };
    if (diferentaZile <= 7) return { clasa: 'atentie-medie', text: 'Verifică' };
    return { clasa: 'ok', text: 'În termen' };
};

/**
 * Componentă pentru afișarea unui produs
 */
const ProductCard = ({
    item,
    onToggleOfera,
    onClaim,
    onUndoClaim,
    onShareToGroup,
    onShare,
    onDelete
}) => {
    const status = calculeazaStatus(item.data_expirare);
    const isDisponibil = item.disponibil === true;

    return (
        <div className={`card ${isDisponibil ? 'oferit' : ''} ${status.clasa}`}>
            <div>
                <div className="meta">
                    <div>
                        <div className="nume-produs">{item.nume}</div>
                        <div className="data-produs">
                            {item.categorie || '—'} • {item.cantitate_nr ? `${item.cantitate_nr} kg` : (item.cantitate || '—')}
                            {item.pret_per_kg ? ` • ${item.pret_per_kg} lei/kg` : ''}
                        </div>
                    </div>
                    <div className="meta-right">
                        <div className="badge-status">{status.text}</div>
                        <button className="btn btn-danger small" onClick={() => onDelete(item.id)}>
                            Șterge
                        </button>
                    </div>
                </div>
                <div style={{ marginTop: 8, color: '#6b7280' }}>{item.descriere}</div>
            </div>

            <div className="actions">
                <button className="btn btn-primary" onClick={() => onToggleOfera(item.id, isDisponibil)}>
                    {isDisponibil ? 'Retrage oferta' : 'Oferă'}
                </button>
                <button className="btn btn-claim" onClick={() => onClaim(item)}>Claim</button>
                <button className="btn btn-warning" onClick={() => onUndoClaim(item)}>↩ Anulează</button>
                <button className="btn btn-ghost" onClick={() => onShareToGroup(item)}>📤 Grup</button>
                <button className="btn btn-ghost" onClick={() => onShare('facebook', item)}>📘 FB</button>
                <button className="btn btn-ghost" onClick={() => onShare('instagram', item)}>📷 IG</button>
            </div>
        </div>
    );
};

export default ProductCard;
