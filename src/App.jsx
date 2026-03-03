import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import axios from "axios";
import { v4 } from "uuid";
import { Search, Eye, Pen, Plus } from "lucide-react";
import modeContext from "./contexts/ModeContext";
import BuildingCard from "./components/BuildingCard";
import NewBuildingForm from "./components/NewBuildingForm";



const reducer = (state, action) => {
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
  }
};

function App() {
  const items = JSON.parse(localStorage.getItem("data"));
  const [mode, setMode] = useState("view");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const [buildings, dispatch] = useReducer(reducer, []);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuildings = useMemo(() => {
    return buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.city.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [buildings, searchQuery]);

  const removeBuilding = useCallback((id) => {
    dispatch({ type: "REMOVE_BUILDING", id });
  });

  useEffect(() => {
    if (items) {
      setLoading(true);
      dispatch({ type: "SET_BUILDINGS", buildings: items });
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://jsonplaceholder.typicode.com/users",
        );
        dispatch({ type: "SET_BUILDINGS", buildings: response.data });
        setLoading(false);
      } catch (err) {
        console.log("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    document.body.style.overflow = adding ? "hidden" : "";
  }, [adding]);

  return (
    <>
      <modeContext.Provider value={{ mode, setMode }}>
        <div className={`bg-black ${adding ? "h-screen " : "min-h-screen"}`}>
          {adding && (
            <div className="fixed top-0 bottom-0 right-0 left-0 bg-black transition-opacity z-1 opacity-50" />
          )}
          <NewBuildingForm
            adding={adding}
            setAdding={setAdding}
            mainDispatch={dispatch}
          />
          <div className={`bg-black py-8 px-12 `}>
            <div className="flex items-center py-4 h-max justify-between">
              <div className="flex gap-4 py-4 items-center">
                <h1 className="text-white text-4xl">Site Zone Manager</h1>
                <div className="flex bg-white rounded-lg">
                  <button
                    onClick={() => setMode("view")}
                    className={`p-1 rounded-l-lg hover:cursor-pointer ${mode === "view" && "bg-yellow-400 translate-x-0" } duration-300 transition-colors`}
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setMode("edit")}
                    className={`p-1 rounded-r-lg hover:cursor-pointer ${mode === "edit" && "bg-yellow-400 translate-x-0"} duration-300 transition-colors`}
                  >
                    <Pen className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {mode == "edit" && (
                <button
                  onClick={() => setAdding(true)}
                  className="bg-white p-4 rounded-lg mr-24 hover:cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  <Plus />
                </button>
              )}
            </div>

            <div className="bg-white rounded-xl mt-12">
              <Search className="absolute m-4" />
              <input
                className="p-4 ml-8 w-full rounded-xl focus:outline-none"
                value={searchQuery}
                placeholder="Search name or zone..."
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <h2 className="text-white text-2xl mt-12">Buildings</h2>

            {loading ? (
              <p className="text-white flex items-center justify-center mt-6 text-3xl">
                Loading buildings...
              </p>
            ) : (
              <div className="mt-6 grid grid-cols-4 gap-2">
                {filteredBuildings.map((building) => (
                  <BuildingCard
                    key={building.id}
                    building={building}
                    dispatch={dispatch}
                    removeBuilding={removeBuilding}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </modeContext.Provider>
    </>
  );
}

export default App;
