/**
 * @fileoverview Componentă AddProductForm
 * @module components/AddProductForm
 */

import React from 'react';

/**
 * Formular pentru adăugarea unui produs nou
 */
const AddProductForm = ({
    nume,
    setNume,
    cantitateNr,
    setCantitateNr,
    pretPerKg,
    setPretPerKg,
    data,
    setData,
    categorie,
    setCategorie,
    categorii,
    onSubmit,
    setFiltroCategorie,
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit();
    };

    return (
        <div className="top-bar">
            <form className="form-adaugare" onSubmit={handleSubmit}>
                <input
                    placeholder="Nume produs"
                    value={nume}
                    onChange={(e) => setNume(e.target.value)}
                />
                <input
                    placeholder="Cantitate (kg)"
                    value={cantitateNr}
                    onChange={(e) => setCantitateNr(e.target.value)}
                />
                <input
                    placeholder="Preț per kg"
                    value={pretPerKg}
                    onChange={(e) => setPretPerKg(e.target.value)}
                />
                <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                />
                <select
                    value={categorie}
                    onChange={(e) => {
                        setCategorie(e.target.value.trim());
                        setFiltroCategorie(e.target.value.trim());
                    }}
                >
                    <option value="">Categorie</option>
                    {categorii.map((c) => (
                        <option key={c} value={c}>
                            {c}
                        </option>
                    ))}
                </select>
                <button type="submit">Adaugă</button>
            </form>
        </div>
    );
};

export default AddProductForm;
