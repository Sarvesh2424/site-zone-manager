import { X } from "lucide-react";
import { memo, useReducer } from "react";
import { Buildingreducer } from "../reducers/BuildingsReducer";
import React from "react";

const NewBuildingForm = ({ adding, setAdding, addBuilding }) => {
  const [formState, dispatch] = useReducer(Buildingreducer, {
    name: "",
    zone: "",
  });
  return (
    <div
      className={`fixed top-0 right-0 h-full bg-white w-1/5 shadow-2xl rounded-l-4xl z-20 p-8 duration-300 ease-out
        ${adding ? "translate-x-0" : "translate-x-full"}`}
    >
      <button onClick={() => setAdding(false)} className="hover:cursor-pointer">
        <X className="w-10 h-10" />
      </button>
      <h1 className="text-4xl font-semibold mt-4">Add</h1>
      <h1 className="text-4xl font-semibold">Building</h1>
      <div className="flex flex-col mt-16">
        <label>Name</label>
        <input
          onChange={(e) => dispatch({ type: "SET_NAME", name: e.target.value })}
          value={formState.name}
          placeholder="Enter name..."
          className="border mt-2 border-black p-2 rounded-lg"
        />
        <label className="mt-4">Zone</label>
        <input
          onChange={(e) => dispatch({ type: "SET_ZONE", zone: e.target.value })}
          value={formState.zone}
          placeholder="Enter zone..."
          className="border mt-2 border-black p-2 rounded-lg"
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            addBuilding(formState.name, formState.zone);
            setAdding(false);
          }}
          className="p-2 rounded-lg bg-green-500 text-white mt-12 hover:cursor-pointer hover:bg-green-600 transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default React.memo(NewBuildingForm);
