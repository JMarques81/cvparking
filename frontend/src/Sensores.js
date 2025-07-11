import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Sensores = () => {
    const [sensores, setSensores] = useState([]);
    const [erro, setErro] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/sensores')
            .then(response => {
                console.log("📡 Dados recebidos do backend:", response.data); // Debug
                if (Array.isArray(response.data)) {
                    setSensores(response.data);
                } else {
                    setErro("Os dados recebidos não são um array!");
                }
            })
            .catch(error => {
                console.error('❌ Erro ao buscar sensores:', error);
                setErro("Erro ao carregar os sensores.");
            });
    }, []);

    if (erro) {
        return <p style={{ color: "red" }}>⚠️ {erro}</p>;
    }

    return (
        <div>
            <h1>Estado dos Sensores</h1>
            {sensores.length > 0 ? (
                <ul>
                    {sensores.map((sensor, index) => (
                        sensor ? ( // ✅ Evita erro se sensor for null
                            <li key={index}>
                                {sensor.id_sensor || "Sem ID"} - {sensor.estado || "Sem Estado"} - 
                                {sensor.timestamp ? new Date(sensor.timestamp).toLocaleString() : "Sem Data"}
                            </li>
                        ) : (
                            <li key={index}>⚠️ Sensor inválido</li>
                        )
                    ))}
                </ul>
            ) : (
                <p>⚠️ Nenhum sensor encontrado.</p>
            )}
        </div>
    );
};

export default Sensores;
