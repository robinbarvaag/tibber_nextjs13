"use client";

import React, { useState } from "react";

const zones = [
  { name: "Sone 1", description: "Kaldt og kort vekstsesong" },
  { name: "Sone 2", description: "Kaldt med kort vekstsesong" },
  { name: "Sone 3", description: "Kaldt med lengre vekstsesong" },
  { name: "Sone 4", description: "Mildt med kort vekstsesong" },
  { name: "Sone 5", description: "Mildt med lengre vekstsesong" },
  { name: "Sone 6", description: "Mildt med lang vekstsesong" },
  { name: "Sone 7", description: "Varmt med kort vekstsesong" },
  { name: "Sone 8", description: "Varmt med lengre vekstsesong" },
  { name: "Sone 9", description: "Varmt med lang vekstsesong" },
];

function ZoneSelector() {
  const [selectedZone, setSelectedZone] = useState<any>(null);

  function handleZoneSelect(zone) {
    setSelectedZone(zone);
  }

  return (
    <div>
      <h2>Velg din dyrkesone</h2>
      <ul style={{ cursor: "pointer" }}>
        {zones.map((zone) => (
          <li key={zone.name} onClick={() => handleZoneSelect(zone)}>
            {zone.name}
          </li>
        ))}
      </ul>
      {selectedZone && (
        <div>
          <h3>Beskrivelse av {selectedZone.name}</h3>
          <p>{selectedZone.description}</p>
        </div>
      )}
    </div>
  );
}
export default ZoneSelector;
