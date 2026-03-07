import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import axios from "axios";
import { Search, Eye, Pen, Plus } from "lucide-react";
import modeContext from "./contexts/ModeContext";
import BuildingCard from "./components/BuildingCard";
import NewBuildingForm from "./components/NewBuildingForm";
import reducer from "./reducers/BuildingsReducer";

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
  }, [JSON.stringify(buildings), searchQuery]);

  console.log("Buildings : ", buildings);
  console.log("Filtered buildings: ", filteredBuildings);

  const addBuilding = useCallback(
    (name, zone) => {
      console.log("being called callback");
      dispatch({ type: "ADD_BUILDING", name, zone });
    },
    [JSON.stringify(buildings)],
  );

  const removeBuilding = useCallback(
    (id) => {
      console.log("being called callback");
      dispatch({ type: "REMOVE_BUILDING", id });
    },
    [JSON.stringify(buildings)],
  );

  const addNote = useCallback(
    (id, note) => {
      console.log("being called callback");
      dispatch({ type: "ADD_NOTE", id, note });
    },
    [JSON.stringify(buildings)],
  );

  const addGate = useCallback(
    (id, gate) => {
      console.log("being called callback");
      dispatch({ type: "ADD_GATE", id, gate });
    },
    [JSON.stringify(buildings)],
  );

  const addExit = useCallback(
    (id, exit) => {
      console.log("being called callback");
      dispatch({ type: "ADD_EXIT", id, exit });
    },
    [JSON.stringify(buildings)],
  );

  const removeGate = useCallback(
    (id, gId) => {
      console.log("being called callback");
      dispatch({ type: "REMOVE_GATE", id, gId });
    },
    [JSON.stringify(buildings)],
  );

  const removeExit = useCallback(
    (id, eId) => {
      console.log("being called callback");
      dispatch({ type: "REMOVE_EXIT", id, eId });
    },
    [JSON.stringify(buildings)],
  );

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

  return (
    <>
      <modeContext.Provider value={{ mode, setMode }}>
        <div className={`bg-black ${adding ? "h-screen " : "min-h-screen"}`}>
          {adding && (
            <div className="fixed top-0 pointer-events-none bottom-0 right-0 left-0 bg-black transition-opacity z-10 opacity-50" />
          )}
          <NewBuildingForm
            adding={adding}
            setAdding={setAdding}
            mainDispatch={dispatch}
            addBuilding={addBuilding}
          />
          <div
            className={`bg-black py-8 px-12 ${adding && "pointer-events-none"} `}
          >
            <div className="flex items-center py-4 h-max justify-between">
              <div className="flex gap-4 py-4 items-center">
                <h1 className="text-white text-4xl">Site Zone Manager</h1>
                <div className="flex bg-white rounded-lg">
                  <button
                    onClick={() => setMode("view")}
                    className={`p-1 rounded-l-lg hover:cursor-pointer ${mode === "view" && "bg-yellow-400 translate-x-0"} duration-300 transition-colors`}
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
                    removeBuilding={removeBuilding}
                    addNote={addNote}
                    removeGate={removeGate}
                    removeExit={removeExit}
                    addGate={addGate}
                    addExit={addExit}
                  />
                ))}
                {/* {searchQuery &&
                  filteredBuildings.map((building) => (
                    <BuildingCard
                      key={building.id}
                      building={building}
                      removeBuilding={removeBuilding}
                      addNote={addNote}
                      removeGate={removeGate}
                      removeExit={removeExit}
                      addGate={addGate}
                      addExit={addExit}
                    />
                  ))} */}
              </div>
            )}
          </div>
        </div>
      </modeContext.Provider>
    </>
  );
}

export default App;
