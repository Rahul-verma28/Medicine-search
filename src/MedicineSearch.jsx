// src/MedicineSearch.jsx
import React, { useState } from "react";

const MedicineSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `https://backend.cappsule.co.in/api/v1/new_search?q=${searchTerm}&pharmacyIds=1,2,3`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const saltSuggestions = data.data.saltSuggestions;
      setResults(saltSuggestions);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const getLowestPrice = (saltFormsJson, form, strength, packing) => {
    const products = saltFormsJson?.[form]?.[strength]?.[packing];
    if (!products) return null;

    const prices = Object.values(products)
      .flat()
      .filter((product) => product !== null)
      .map((product) => product.selling_price);

    return prices.length ? Math.min(...prices) : null;
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Medicine Search</h1>
      <div className="flex mb-4 border rounded-full shadow-lg p-4">
        <span className="">🔍</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder=" Enter medicine name"
          className="px-2 flex-grow border border-none rounded-full outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
        />
        <button onClick={handleSearch} className=" text-black">
          Search
        </button>
      </div>
      <hr className="my-10 border border-t border-10"/>
      {loading && <p className="text-blue-500">Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      <div>
        {results.length > 0
          ? results.map((result) => {
              const {most_common } = result;
              const { Form, Strength, Packing } = most_common;
              const lowestPrice = getLowestPrice(
                result.salt_forms_json,
                Form,
                Strength,
                Packing
              );

              return (
                <div className="grid grid-cols-3 rounded-xl bg-gradient-to-r from-white to-gray-200 to-90% m-3 shadow-xl px-8 py-5 text-left my-10">
                  <div key={result.id} className=" ">
                    <p>
                      <span>Form:</span>{"             "}
                      {result.available_forms.map((form) => {
                        return (
                          <button
                            key={result.id}
                            className="px-2 py-1 m-1 text-xs font-bold border-2 border-dashed focus:border-solid focus:shadow-md focus:shadow-green-900 focus:border-green-900 rounded-md"
                          >
                            {form}
                          </button>
                        );
                      })}
                    </p>
                    <p>
                      <span >Strength:</span>{" "}
                      <button
                            key={result.id}
                            className="px-2 py-1 m-1 text-xs font-bold border-2 border-dashed focus:border-solid focus:shadow-md focus:shadow-green-900 focus:border-green-900 rounded-md"
                          >
                            {Strength}
                          </button>
                    </p>
                    <p >
                      <span >Packing:</span>
                      <button
                            key={result.id}
                            className="px-2 py-1 m-1 text-xs font-bold border-2 border-dashed focus:border-solid focus:shadow-md focus:shadow-green-900 focus:border-green-900 rounded-md"
                          >
                            {Packing.split(' ')[0]} strips
                          </button> 
                    </p>
                  </div>
                  <div className="flex justify-center items-center">
                        <div>
                        <p className="font-bold text-lg text-center py-2">Salt A</p>
                        <p className=" text-green-950 text-sm">Tablet |100 mg| 5 strips</p>
                        </div>
                  </div>
                   <div className="flex justify-center items-center">
                   {lowestPrice? <p className="font-bold text-3xl text-green-950">Form {lowestPrice}</p> :
                    <button className="border border-black p-3 font-semibold text-xs w-[60%]">No stores selling this product near you</button>
                   }
                  </div>
                </div>
              );
            })
          : !loading && <p>No results found</p>}
      </div>
    </div>
  );
};

export default MedicineSearch;
