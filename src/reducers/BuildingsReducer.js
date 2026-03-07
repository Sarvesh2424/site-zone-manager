import { v4 } from "uuid";

export const reducer = (state, action) => {
  console.log("✅ Reducer A");
  switch (action.type) {
    case "SET_BUILDINGS":
      const data = action.buildings;
      localStorage.setItem("data", JSON.stringify(data));
      return data;
    case "ADD_BUILDING":
      const buildingId = v4();
      const dataAfterAdd = [
        ...state,
        {
          id: buildingId,
          name: action.name,
          address: { city: action.zone },
        },
      ];
      localStorage.setItem("data", JSON.stringify(dataAfterAdd));
      return dataAfterAdd;
    case "REMOVE_BUILDING":
      const dataAfterRemoval = state.filter((b) => b.id !== action.id);
      localStorage.setItem("data", JSON.stringify(dataAfterRemoval));
      return dataAfterRemoval;
    case "ADD_NOTE":
      const dataAfterNoteAdd = state.map((b) =>
        b.id === action.id ? { ...b, note: action.note } : b,
      );
      localStorage.setItem("data", JSON.stringify(dataAfterNoteAdd));
      return dataAfterNoteAdd;
    case "ADD_GATE":
      const gateId = v4();
      const dataAfterGateAdd = state.map((b) =>
        b.id === action.id
          ? {
              ...b,
              gates: [...(b.gates || []), { id: gateId, gate: action.gate }],
            }
          : b,
      );
      localStorage.setItem("data", JSON.stringify(dataAfterGateAdd));
      return dataAfterGateAdd;
    case "ADD_EXIT":
      const exitId = v4();
      const dataAfterExitAdd = state.map((b) =>
        b.id === action.id
          ? {
              ...b,
              exits: [...(b.exits || []), { id: exitId, exit: action.exit }],
            }
          : b,
      );
      localStorage.setItem("data", JSON.stringify(dataAfterExitAdd));
      return dataAfterExitAdd;
    case "REMOVE_GATE":
      const dataAfterGateRemoval = state.map((b) =>
        b.id === action.id
          ? { ...b, gates: b.gates.filter((g) => g.id !== action.gId) }
          : b,
      );
      localStorage.setItem("data", JSON.stringify(dataAfterGateRemoval));
      return dataAfterGateRemoval;
    case "REMOVE_EXIT":
      const dataAfterExitRemoval = state.map((b) =>
        b.id === action.id
          ? { ...b, exits: b.exits.filter((e) => e.id !== action.eId) }
          : b,
      );
      localStorage.setItem("data", JSON.stringify(dataAfterExitRemoval));
      return dataAfterExitRemoval;
    default:
      return state;
  }
};

export const Buildingreducer = (state, action) => {
  console.log("✅ Reducer B");
  console.log("Reducer B");
  switch (action.type) {
    case "SET_NAME":
      return { ...state, name: action.name };
    case "SET_ZONE":
      return { ...state, zone: action.zone };
    default:
      return state;
  }
};

export const IndividualBuildingreducer = (state, action) => {
  console.log("✅ Reducer C");
  switch (action.type) {
    case "SET_GATE":
      return { ...state, gate: action.gate };
    case "SET_EXIT":
      return { ...state, exit: action.exit };
    default:
      return state;
  }
};
