import React, { useState } from 'react';
import './App.css';

// Mock data based on the schema in index.tsx
const mockData = {
  equipmentList: ["Loader 1", "Haul Truck 05", "Drill Rig 7", "Excavator 22"],
  systemTypes: ["Hydraulics", "Engine", "Electrical", "Transmission"],
  faultTypes: ["Leak", "High Temperature", "Low Pressure", "Sensor Failure"],
  sections: [
    { name: "Mechanical", color: "#FF6347" },
    { name: "Electrical", color: "#4682B4" },
    { name: "Hydraulics", color: "#32CD32" },
  ],
  equipmentRelations: [], // Not used for the initial UI layout
};

function App() {
  const [equipment, setEquipment] = useState(mockData.equipmentList);
  const [sections, setSections] = useState(mockData.sections);
  const [systemTypes, setSystemTypes] = useState(mockData.systemTypes);
  const [faultTypes, setFaultTypes] = useState(mockData.faultTypes);
  const [selectedItems, setSelectedItems] = useState({});

  const handleCheckboxChange = (category, item) => {
    setSelectedItems(prev => {
      const newCategory = { ...prev[category], [item]: !prev[category]?.[item] };
      return { ...prev, [category]: newCategory };
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Relationship Builder</h1>
      </header>
      <div className="relationship-builder">
        <div className="builder-section">
          <h2>Equipment</h2>
          {equipment.map(item => (
            <div key={item} className="item-block">
              <input
                type="checkbox"
                id={`equip-${item}`}
                checked={!!selectedItems.equipment?.[item]}
                onChange={() => handleCheckboxChange('equipment', item)}
              />
              <label htmlFor={`equip-${item}`}>{item}</label>
            </div>
          ))}
        </div>
        <div className="builder-section">
          <h2>Responsible</h2>
          {sections.map(item => (
            <div key={item.name} className="item-block">
              <input
                type="checkbox"
                id={`section-${item.name}`}
                checked={!!selectedItems.sections?.[item.name]}
                onChange={() => handleCheckboxChange('sections', item.name)}
              />
              <label htmlFor={`section-${item.name}`}>{item.name}</label>
            </div>
          ))}
        </div>
        <div className="builder-section">
          <h2>System Types</h2>
          {systemTypes.map(item => (
            <div key={item} className="item-block">
              <input
                type="checkbox"
                id={`system-${item}`}
                checked={!!selectedItems.systemTypes?.[item]}
                onChange={() => handleCheckboxChange('systemTypes', item)}
              />
              <label htmlFor={`system-${item}`}>{item}</label>
            </div>
          ))}
        </div>
        <div className="builder-section">
          <h2>Fault Types</h2>
          {faultTypes.map(item => (
            <div key={item} className="item-block">
              <input
                type="checkbox"
                id={`fault-${item}`}
                checked={!!selectedItems.faultTypes?.[item]}
                onChange={() => handleCheckboxChange('faultTypes', item)}
              />
              <label htmlFor={`fault-${item}`}>{item}</label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
