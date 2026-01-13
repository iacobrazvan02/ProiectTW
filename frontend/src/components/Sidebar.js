/**
 * @fileoverview Componentă Sidebar
 * @module components/Sidebar
 */

import React from 'react';

/**
 * Componentă Sidebar cu filtre și grupuri
 */
const Sidebar = ({
    categorii,
    filtroCategorie,
    setFiltroCategorie,
    onShareCategory,
    alerts,
    grupuri,
    grupNume,
    setGrupNume,
    onCreateGrup,
    onLoadMembri,
    onAddMember,
    onInviteFriend,
}) => {
    return (
        <aside className="sidebar">
            <h3>Filtre</h3>
            <div className="filters">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <label style={{ flex: 1 }}>
                        <input
                            type="radio"
                            name="f"
                            checked={!filtroCategorie}
                            onChange={() => setFiltroCategorie('')}
                        />
                        {' '}Toate
                    </label>
                    <button className="btn btn-ghost" onClick={() => onShareCategory('')}>
                        Share→Grup
                    </button>
                </div>
                {categorii.map((c) => (
                    <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <label style={{ flex: 1 }}>
                            <input
                                type="radio"
                                name="f"
                                checked={filtroCategorie === c}
                                onChange={() => setFiltroCategorie(c)}
                            />
                            {' '}{c}
                        </label>
                        <button className="btn btn-ghost" onClick={() => onShareCategory(c)}>
                            Share→Grup
                        </button>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 12 }}>
                <h3>⚠️ Alertă Expirare</h3>
                {alerts.length === 0 ? (
                    <div className="footer-note">Nicio alertă</div>
                ) : (
                    alerts.map((a) => (
                        <div key={a.id} style={{ padding: '6px 0' }}>
                            {a.nume} — {a.data_expirare ? a.data_expirare.split('T')[0] : 'N/A'}
                        </div>
                    ))
                )}
            </div>

            <div style={{ marginTop: 12 }}>
                <h3>👥 Grupuri de Prieteni</h3>
                <div style={{ display: 'flex', gap: 8 }}>
                    <input
                        placeholder="Nume grup"
                        value={grupNume}
                        onChange={(e) => setGrupNume(e.target.value)}
                    />
                    <button className="btn" onClick={onCreateGrup}>
                        Creează
                    </button>
                </div>
                <div style={{ marginTop: 8 }}>
                    {grupuri.length === 0 ? (
                        <div className="footer-note">Niciun grup</div>
                    ) : (
                        grupuri.map((g) => (
                            <div key={g.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                                <strong>{g.nume}</strong> <small>({g.membri_count || 0} membri)</small>
                                <div style={{ marginTop: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                    <button
                                        className="btn btn-ghost small"
                                        onClick={() => onLoadMembri(g.id)}
                                    >
                                        👁️ Membri
                                    </button>
                                    <button
                                        className="btn btn-ghost small"
                                        onClick={() => onAddMember(g.id)}
                                    >
                                        ➕ Adaugă
                                    </button>
                                    <button
                                        className="btn btn-primary small"
                                        onClick={() => onInviteFriend(g.id, g.nume)}
                                    >
                                        📨 Invită prieten
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
