/**
 * @fileoverview Pagina principală Dashboard
 * @module pages/Dashboard
 */

import React, { useState, useEffect } from 'react';
import { alimenteAPI, grupuriAPI, socialAPI } from '../services/api';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import ProductCard from '../components/ProductCard';
import AddProductForm from '../components/AddProductForm';

/**
 * Pagina principală cu inventarul de alimente
 */
const Dashboard = () => {
    // State pentru inventar
    const [inventar, setInventar] = useState([]);
    const [categorii, setCategorii] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [filtroCategorie, setFiltroCategorie] = useState('');

    // State pentru formular
    const [nume, setNume] = useState('');
    const [data, setData] = useState('');
    const [cantitateNr, setCantitateNr] = useState('');
    const [pretPerKg, setPretPerKg] = useState('');
    const [categorie, setCategorie] = useState('');

    // State pentru grupuri
    const [grupuri, setGrupuri] = useState([]);
    const [grupNume, setGrupNume] = useState('');

    // Încarcă datele la montare
    useEffect(() => {
        loadAll();
        loadAlerts();
        loadGrupuri();
    }, []);

    const loadAll = async () => {
        try {
            const data = await alimenteAPI.getAll();
            setInventar(data);

            const map = new Map();
            data.forEach((i) => {
                if (i.categorie) {
                    const key = i.categorie.trim().toLowerCase();
                    if (!map.has(key)) map.set(key, i.categorie.trim());
                }
            });
            ['Fructe', 'Legume', 'Conserve', 'Carne', 'Lactate'].forEach((d) => {
                const k = d.toLowerCase();
                if (!map.has(k)) map.set(k, d);
            });
            setCategorii(Array.from(map.values()));
        } catch (err) {
            console.error('Eroare încărcare alimente:', err);
        }
    };

    const loadAlerts = async () => {
        try {
            const data = await alimenteAPI.getAlerts(10);
            setAlerts(data);
        } catch (err) {
            console.error('Eroare încărcare alerte:', err);
        }
    };

    const loadGrupuri = async () => {
        try {
            const data = await grupuriAPI.getAll();
            setGrupuri(data);
        } catch (err) {
            console.error('Eroare încărcare grupuri:', err);
        }
    };

    // Handlers pentru alimente
    const adaugaProdus = async () => {
        if (!nume) {
            alert('Completează numele produsului');
            return;
        }
        try {
            const item = await alimenteAPI.add({
                nume,
                categorie,
                cantitate_nr: cantitateNr || null,
                pret_per_kg: pretPerKg || null,
                data_expirare: data ? data + 'T00:00:00' : null,
            });
            setInventar((prev) => [...prev, item]);
            if (categorie) {
                setCategorii((prev) => {
                    const map = new Map();
                    prev.forEach((p) => map.set(p.toLowerCase(), p));
                    if (!map.has(categorie.toLowerCase())) map.set(categorie.toLowerCase(), categorie);
                    return Array.from(map.values());
                });
            }
            setNume('');
            setData('');
            setCantitateNr('');
            setPretPerKg('');
            setCategorie('');
            loadAlerts();
        } catch (err) {
            console.error(err);
            alert('Eroare la salvare');
        }
    };

    const toggleOfera = async (id, isDisponibil) => {
        try {
            if (!isDisponibil) {
                const details = window.prompt('Detalii ofertă (preț/observații) — lasă gol dacă nu e cazul');
                const updated = await alimenteAPI.toggleOfera(id, true, details);
                setInventar((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            } else {
                const confirm = window.confirm('Anulezi oferta?');
                if (!confirm) return;
                const updated = await alimenteAPI.toggleOfera(id, false);
                setInventar((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
            }
        } catch (err) {
            console.error(err);
            alert('Eroare la actualizare');
        }
    };

    const claim = async (item) => {
        try {
            window.prompt('Numele tău pentru claim (sau lasă gol pentru anonim)');
            let maxAvailable = item.cantitate_nr ? parseFloat(item.cantitate_nr) : null;
            const amountStr = window.prompt(
                `Câte kg vrei să revendici?${maxAvailable ? ' (Disponibil: ' + maxAvailable + ' kg)' : ''}`,
                '1'
            );
            if (!amountStr) return;
            const amount = parseFloat(amountStr.replace(',', '.'));
            if (isNaN(amount) || amount <= 0) {
                alert('Introduceți o cantitate validă');
                return;
            }
            if (maxAvailable && amount > maxAvailable) {
                alert('Cantitate mai mare decât disponibilul');
                return;
            }
            const conf = window.confirm('Confirmi revendicarea produsului?');
            if (!conf) return;

            const json = await alimenteAPI.claim(item.id, null, amount);
            if (json.updated) {
                setInventar((prev) => prev.map((p) => (p.id === json.updated.id ? json.updated : p)));
            }
            loadAlerts();
            alert('Produs revendicat cu succes');
        } catch (err) {
            console.error(err);
            alert('Eroare la claim');
        }
    };

    const undoClaim = async (item) => {
        const amountStr = window.prompt('Câte kg vrei să restaurezi?', '1');
        if (!amountStr) return;
        const amount = parseFloat(amountStr.replace(',', '.'));
        if (isNaN(amount) || amount <= 0) {
            alert('Introduceți o cantitate validă');
            return;
        }
        const conf = window.confirm(`Confirmi restaurarea a ${amount} kg?`);
        if (!conf) return;

        try {
            const json = await alimenteAPI.undoClaim(item.id, amount);
            if (json.updated) {
                setInventar((prev) => prev.map((p) => (p.id === json.updated.id ? json.updated : p)));
            }
            alert(`Restaurat ${json.restored} kg cu succes!`);
        } catch (err) {
            console.error(err);
            alert('Eroare la anulare claim');
        }
    };

    const deleteProduct = async (id) => {
        const ok = window.confirm('Sigur vrei să ștergi acest produs?');
        if (!ok) return;
        try {
            await alimenteAPI.delete(id);
            setInventar((prev) => prev.filter((p) => p.id !== id));
            loadAlerts();
        } catch (err) {
            console.error(err);
            alert('Eroare la ștergere');
        }
    };

    // Handlers pentru grupuri
    const createGrup = async () => {
        if (!grupNume.trim()) {
            alert('Completează numele grupului');
            return;
        }
        try {
            const g = await grupuriAPI.create(grupNume.trim());
            setGrupuri((prev) => [g, ...prev]);
            setGrupNume('');
        } catch (err) {
            console.error(err);
            alert('Eroare la creare grup');
        }
    };

    const loadMembri = async (grupId) => {
        try {
            const data = await grupuriAPI.getMembri(grupId);
            if (data.length === 0) {
                alert('Niciun membru în acest grup');
                return;
            }
            const options = data.map((d, i) => `${i + 1}. ${d.nume}${d.etichete ? ' — ' + d.etichete : ''}`).join('\n');
            const choice = window.prompt(
                `Membri grup:\n${options}\n\nPentru a șterge un membru, introdu numărul lui (sau lasă gol pentru a închide):`,
                ''
            );
            if (choice && choice.trim() !== '') {
                const idx = parseInt(choice, 10) - 1;
                if (isNaN(idx) || idx < 0 || idx >= data.length) {
                    alert('Selecție invalidă');
                    return;
                }
                const membruDeStres = data[idx];
                const confirm = window.confirm(`Sigur vrei să ștergi pe "${membruDeStres.nume}" din grup?`);
                if (confirm) {
                    await grupuriAPI.deleteMembru(grupId, membruDeStres.id);
                    alert('Membru șters cu succes!');
                    loadGrupuri();
                }
            }
        } catch (err) {
            console.error(err);
            alert('Eroare');
        }
    };

    const addMember = async (grupId) => {
        const nume = window.prompt('Nume prieten:');
        if (!nume) return;
        const etichete = window.prompt('Etichete (vegetarian, carnivor, etc.) - opțional:');
        try {
            await grupuriAPI.addMembru(grupId, nume, etichete || null);
            alert('Membru adăugat cu succes!');
            loadGrupuri();
        } catch (err) {
            console.error(err);
            alert('Eroare');
        }
    };

    const inviteFriend = async (grupId, grupNumeLocal) => {
        const email = window.prompt('Email-ul prietenului (opțional):');
        try {
            const invite = await grupuriAPI.createInvite(grupId, email || null);
            const message = `🎉 Invitație creată pentru grupul "${grupNumeLocal}"!\n\nLink de partajat:\n${invite.invite_link}`;
            if (navigator.clipboard) {
                await navigator.clipboard.writeText(invite.invite_link);
                alert(message + '\n\n✅ Link-ul a fost copiat în clipboard!');
            } else {
                alert(message);
            }
        } catch (err) {
            console.error(err);
            alert('Eroare la creare invitație');
        }
    };

    const shareToGroup = async (item) => {
        if (!grupuri.length) {
            alert('Nu ai niciun grup. Creează unul mai întâi.');
            return;
        }
        const opt = grupuri.map((g, i) => `${i + 1}. ${g.nume}`).join('\n');
        const sel = window.prompt('Alege grupul prin număr:\n' + opt, '1');
        if (!sel) return;
        const idx = parseInt(sel, 10) - 1;
        if (isNaN(idx) || idx < 0 || idx >= grupuri.length) {
            alert('Selecție invalidă');
            return;
        }
        try {
            await grupuriAPI.shareAliment(item.id, grupuri[idx].id);
            alert('Produs partajat în grup!');
        } catch (err) {
            console.error(err);
            alert('Eroare la share');
        }
    };

    const shareCategory = async (cat) => {
        if (!grupuri.length) {
            alert('Nu ai niciun grup. Creează unul mai întâi.');
            return;
        }
        const opt = grupuri.map((g, i) => `${i + 1}. ${g.nume}`).join('\n');
        const sel = window.prompt('Alege grupul pentru categoria "' + (cat || 'Toate') + '":\n' + opt, '1');
        if (!sel) return;
        const idx = parseInt(sel, 10) - 1;
        if (isNaN(idx) || idx < 0 || idx >= grupuri.length) {
            alert('Selecție invalidă');
            return;
        }
        try {
            const json = await grupuriAPI.shareCategorie(cat || null, grupuri[idx].id);
            alert('Partajare completă — inserate: ' + (json.inserted || 0));
        } catch (err) {
            console.error(err);
            alert('Eroare la share categorie');
        }
    };

    // Social share
    const share = (platform, item) => {
        const text = `🥬 Ofer GRATUIT: ${item.nume}\n📅 Expiră: ${item.data_expirare ? item.data_expirare.split('T')[0] : 'N/A'}\n📦 Cantitate: ${item.cantitate_nr ? item.cantitate_nr + ' kg' : 'disponibil'}\n\n#AntiRisipa #GreenShelf #ZeroWaste #FoodSharing`;

        if (platform === 'facebook') {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
            }
            window.open('https://www.facebook.com/', '_blank');
            alert('✅ Textul a fost copiat!\n\n1. Facebook s-a deschis într-un tab nou\n2. Creează o postare\n3. Lipește textul copiat (Ctrl+V / Cmd+V)');
        } else if (platform === 'instagram') {
            if (navigator.clipboard) {
                navigator.clipboard.writeText(text);
            }
            window.open('https://www.instagram.com/', '_blank');
            alert('✅ Textul a fost copiat!\n\n1. Instagram s-a deschis într-un tab nou\n2. Creează o Poveste sau un Post\n3. Lipește textul copiat (Ctrl+V / Cmd+V)');
        }
        socialAPI.share(platform, item);
    };

    // Filtrare
    const produseFiltrate = filtroCategorie
        ? inventar.filter((i) => (i.categorie || '').trim().toLowerCase() === filtroCategorie.trim().toLowerCase())
        : inventar;

    return (
        <>
            <Header />
            <main className="container">
                <AddProductForm
                    nume={nume}
                    setNume={setNume}
                    cantitateNr={cantitateNr}
                    setCantitateNr={setCantitateNr}
                    pretPerKg={pretPerKg}
                    setPretPerKg={setPretPerKg}
                    data={data}
                    setData={setData}
                    categorie={categorie}
                    setCategorie={setCategorie}
                    categorii={categorii}
                    onSubmit={adaugaProdus}
                    setFiltroCategorie={setFiltroCategorie}
                />

                <div className="layout">
                    <Sidebar
                        categorii={categorii}
                        filtroCategorie={filtroCategorie}
                        setFiltroCategorie={setFiltroCategorie}
                        onShareCategory={shareCategory}
                        alerts={alerts}
                        grupuri={grupuri}
                        grupNume={grupNume}
                        setGrupNume={setGrupNume}
                        onCreateGrup={createGrup}
                        onLoadMembri={loadMembri}
                        onAddMember={addMember}
                        onInviteFriend={inviteFriend}
                    />

                    <section>
                        <h2>🧊 Frigiderul Meu</h2>
                        <div className="lista-containter">
                            {produseFiltrate.length === 0 && <div className="card">Nu există produse.</div>}
                            {produseFiltrate.map((item) => (
                                <ProductCard
                                    key={item.id}
                                    item={item}
                                    onToggleOfera={toggleOfera}
                                    onClaim={claim}
                                    onUndoClaim={undoClaim}
                                    onShareToGroup={shareToGroup}
                                    onShare={share}
                                    onDelete={deleteProduct}
                                />
                            ))}
                        </div>
                        <div className="footer-note">Produse afișate: {produseFiltrate.length}</div>
                    </section>
                </div>
            </main>
        </>
    );
};

export default Dashboard;
