import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import axios from "axios";
import { Search, Eye, Pen, Plus } from "lucide-react";
import modeContext from "./contexts/ModeContext";
import BuildingCard from "./components/BuildingCard";
import NewBuildingForm from "./components/NewBuildingForm";
import { reducer } from "./reducers/BuildingsReducer";
import React from "react";

function App() {
  const items = JSON.parse(localStorage.getItem("data"));
  const [mode, setMode] = useState("view");
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [buildings, dispatch] = useReducer(reducer, []);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredBuildings = useMemo(() => {
    console.log("I,M being called");
    return buildings.filter(
      (b) =>
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.address.city.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [buildings.length, searchQuery]);

  const addBuilding = useCallback(
    (name, zone) => {
      console.log("being called callback");

      dispatch({ type: "ADD_BUILDING", name, zone });
    },
    [JSON.stringify(filteredBuildings)],
  );

  const removeBuilding = useCallback(
    (id) => {
      console.log("being called callback");
      setCurrentId(id);
      dispatch({ type: "REMOVE_BUILDING", id });
    },
    [JSON.stringify(filteredBuildings)],
  );

  const addNote = useCallback(
    (id, note) => {
      setCurrentId(id);
      console.log("being called callback");
      dispatch({ type: "ADD_NOTE", id, note });
    },
    [JSON.stringify(filteredBuildings)],
  );

  const addGate = useCallback(
    (id, gate) => {
      setCurrentId(id);
      dispatch({ type: "ADD_GATE", id, gate });
    },
    [JSON.stringify(filteredBuildings)],
  );

  const addExit = useCallback(
    (id, exit) => {
      setCurrentId(id);
      console.log("being called callback");
      dispatch({ type: "ADD_EXIT", id, exit });
    },
    [JSON.stringify(filteredBuildings)],
  );

  const removeGate = useCallback(
    (id, gId) => {
      setCurrentId(id);
      console.log("being called callback");
      dispatch({ type: "REMOVE_GATE", id, gId });
    },
    [JSON.stringify(filteredBuildings)],
  );

  const removeExit = useCallback(
    (id, eId) => {
      setCurrentId(id);
      console.log("being called callback");
      dispatch({ type: "REMOVE_EXIT", id, eId });
    },
    [JSON.stringify(filteredBuildings)],
  );

  const modeContextValue = useMemo(() => ({ mode, setMode }), [mode]);

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
      <modeContext.Provider value={modeContextValue}>
        <div className={`bg-black ${adding ? "h-screen " : "min-h-screen"}`}>
          {adding && (
            <div className="fixed top-0 pointer-events-none bottom-0 right-0 left-0 bg-black transition-opacity z-10 opacity-50" />
          )}

          <div
            className={`bg-black py-8 px-12 ${adding && "pointer-events-none"} `}
          >
            <div className="flex flex-wrap items-center py-4 h-max justify-between">
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
                  onClick={(e) => {
                    setAdding(true);
                  }}
                  className="bg-white p-4 rounded-lg mr-24 hover:cursor-pointer hover:bg-gray-200 md:bg-red-500 transition-colors"
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
              <div className="mt-6 grid grid-cols-1 lg:grid-cols-4 gap-2">
                {filteredBuildings.map((building) => {
                  return (
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
                  );
                })}
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
      {adding && (
        <NewBuildingForm
          adding={adding}
          setAdding={setAdding}
          addBuilding={addBuilding}
        />
      )}
    </>
  );
}

export default React.memo(App);
