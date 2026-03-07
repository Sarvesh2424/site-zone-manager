import React, { memo, useContext, useReducer, useRef, useState } from "react";
import modeContext from "../contexts/ModeContext";
import { Pen, Trash, Check, X, Plus } from "lucide-react";
import { IndividualBuildingreducer } from "../reducers/BuildingsReducer";

const BuildingCard = ({
  building,
  removeBuilding,
  addNote,
  removeGate,
  removeExit,
  addGate,
  addExit,
}) => {
  console.log(building.name);
  const [layout, layoutDispatch] = useReducer(IndividualBuildingreducer, {
    gate: "",
    exit: "",
  });
  const [editing, setEditing] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [note, setNote] = useState("");
  const noteRef = useRef();
  const mode = useContext(modeContext);

  return (
    <div className="p-4 bg-white h-max rounded-xl">
      <div className="flex items-center gap-2 justify-between">
        <div className="py-1 flex gap-2">
          <button
            disabled={mode.mode === "view"}
            onClick={() => {
              setAddingNote(true);
              noteRef.current.focus();
            }}
            className="bg-yellow-400 p-1.5 rounded-lg disabled:bg-gray-400 hover:cursor-pointer disabled:cursor-not-allowed hover:bg-yellow-500 transition-colors"
          >
            Add note
          </button>
          <input
            disabled={mode.mode === "view"}
            onFocus={() => setAddingNote(true)}
            ref={noteRef}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="border border-black rounded-lg p-1 disabled:border-gray-400 disabled:cursor-not-allowed"
          />
        </div>

        {addingNote && mode.mode === "edit" && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                addNote(building.id, note);
                setNote("");
              }}
              className="p-2 bg-green-200 text-green-500 rounded-full hover:cursor-pointer hover:bg-green-300 transition-colors"
            >
              <Check />
            </button>
            <button
              onClick={() => {
                setNote("");
                setAddingNote(false);
              }}
              className="p-2 bg-red-200 text-red-500 rounded-full hover:cursor-pointer hover:bg-red-300 transition-colors"
            >
              <X />
            </button>
          </div>
        )}
      </div>
      <hr className="text-gray-500 mt-4" />

      <div className="flex mt-4 items-center justify-between">
        <h2 className="text-xl py-2">{building.name}</h2>
        {mode.mode === "edit" && (
          <div className="flex gap-2 items-center justify-center">
            <button
              onClick={() =>
                editing === true ? setEditing(false) : setEditing(true)
              }
              className="bg-blue-200 text-blue-500 p-2 rounded-full hover:cursor-pointer hover:bg-blue-300 transition-colors"
            >
              <Pen />
            </button>
            <button
              onClick={() => removeBuilding(building.id)}
              className="bg-red-200 text-red-500 p-2 rounded-full hover:cursor-pointer hover:bg-red-300 transition-colors"
            >
              <Trash />
            </button>
          </div>
        )}
      </div>
      <p className="mt-4">Zone: {building.address.city}</p>
      {building.note && (
        <p className="mt-2 py-2 rounded-lg text-purple-600">
          Note: {building.note}
        </p>
      )}
      <div className="flex justify-around mt-4">
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Gates</h3>
          {building.gates &&
            building.gates.map((gate) => (
              <div
                key={gate.id}
                className="flex items-center gap-4 justify-between"
              >
                <p className="text-green-500">{gate.gate}</p>
                {mode.mode === "edit" && (
                  <button
                    onClick={() => removeGate(building.id, gate.id)}
                    className="text-red-500 hover:cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-bold">Exits</h3>
          {building.exits &&
            building.exits.map((exit) => (
              <div
                key={exit.id}
                className="flex items-center justify-between gap-4"
              >
                <p className="text-red-500">{exit.exit}</p>
                {mode.mode === "edit" && (
                  <button
                    onClick={() => removeExit(building.id, exit.id)}
                    className="text-red-500 hover:cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>
      {editing && mode.mode === "edit" && (
        <div className="flex flex-col">
          <hr className="mt-4 text-gray-500" />
          <form className="mt-4 flex flex-col gap-2">
            <label>Add Gate</label>
            <div className="flex gap-2 justify-between">
              <input
                value={layout.gate}
                onChange={(e) =>
                  layoutDispatch({ type: "SET_GATE", gate: e.target.value })
                }
                className="border w-7/8 border-black rounded-lg p-1"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addGate(building.id, layout.gate);
                  layoutDispatch({ type: "SET_GATE", gate: "" });
                }}
                className="bg-green-300 text-green-500 p-2 rounded-full"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            <label>Add Exit</label>
            <div className="flex gap-2 justify-between">
              <input
                value={layout.exit}
                onChange={(e) =>
                  layoutDispatch({ type: "SET_EXIT", exit: e.target.value })
                }
                className="border w-7/8 border-black rounded-lg p-1"
              />
              <button
                onClick={(e) => {
                  e.preventDefault();
                  addExit(building.id, layout.exit);
                  layoutDispatch({ type: "SET_EXIT", exit: "" });
                }}
                className="bg-green-300 text-green-500 p-2 rounded-full"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default React.memo(BuildingCard);
