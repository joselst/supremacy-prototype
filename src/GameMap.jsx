import { useState, useEffect } from "react";

const regions = [
  { id: 1, name: "Norte", owner: "Jugador", troops: 10 },
  { id: 2, name: "Sur", owner: "Neutral", troops: 5 },
  { id: 3, name: "Este", owner: "Neutral", troops: 8 },
  { id: 4, name: "Oeste", owner: "Neutral", troops: 6 },
  { id: 5, name: "Centro", owner: "Neutral", troops: 4 },
  { id: 6, name: "Islas", owner: "Neutral", troops: 3 },
];

export default function GameMap() {
  const [turn, setTurn] = useState(1);
  const [map, setMap] = useState(regions);
  const [log, setLog] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTurn((prev) => prev + 1);
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  const moveTroops = (fromId, toId, amount) => {
    setMap((prevMap) => {
      const updated = [...prevMap];
      const from = updated.find((r) => r.id === fromId);
      const to = updated.find((r) => r.id === toId);
      if (!from || !to || from.troops < amount || from.owner !== "Jugador") return updated;

      from.troops -= amount;
      if (to.owner !== "Jugador") {
        if (amount > to.troops) {
          to.owner = "Jugador";
          to.troops = amount - to.troops;
          setLog((log) => [...log, `¡Conquista de ${to.name}!`]);
        } else {
          to.troops -= amount;
          setLog((log) => [...log, `Ataque fallido en ${to.name}`]);
        }
      } else {
        to.troops += amount;
        setLog((log) => [...log, `Refuerzo enviado a ${to.name}`]);
      }
      return updated;
    });
  };

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Turno {turn}</h1>
      <div className="grid grid-cols-2 gap-4">
        {map.map((region) => (
          <div key={region.id} className="border p-4 rounded shadow bg-white">
            <h2 className="font-semibold">{region.name}</h2>
            <p>Dueño: {region.owner}</p>
            <p>Tropas: {region.troops}</p>
            {region.owner === "Jugador" && (
              <div className="mt-2">
                <label className="block text-sm">Mover tropas:</label>
                <select
                  className="border px-2 py-1 mt-1"
                  onChange={(e) => moveTroops(region.id, parseInt(e.target.value), 3)}
                >
                  <option>Elegir destino</option>
                  {map
                    .filter((r) => r.id !== region.id)
                    .map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                </select>
              </div>
            )}
          </div>
        ))}
      </div>
      <div>
        <h2 className="text-lg font-semibold">Registro de acciones:</h2>
        <ul className="list-disc pl-5">
          {log.map((entry, i) => (
            <li key={i}>{entry}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}