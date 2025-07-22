// src/components/admin/EditCategoryModal.jsx
import React, { useState } from "react";

const EditCategoryModal = ({ category, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: category?.name || "Historical Cities",
    status: category?.status || "Active",
    cities: ["hurghada"], // Default to Hurghada checked based on design
  });

  const cities = [
    { id: "hurghada", name: "Hurgada" },
    { id: "sharm", name: "Sharm El Shiekh" },
    { id: "marsa", name: "Marsa Alam" },
  ];

  const handleCityToggle = (cityId) => {
    setFormData((prev) => ({
      ...prev,
      cities: prev.cities.includes(cityId)
        ? prev.cities.filter((id) => id !== cityId)
        : [...prev.cities, cityId],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({ ...category, ...formData });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4 w-full max-w-2xl bg-white rounded-xl shadow-lg p-4">
        {/* Header */}
        <div className="flex justify-end items-center gap-2 w-full border-b border-gray-300 pb-2">
          <div className="flex pb-2 items-center gap-2 flex-1">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
                <path
                  d="M9.65366 2.66675H7.12033C4.20033 2.66675 2.66699 4.20008 2.66699 7.10675V9.64008C2.66699 12.5467 4.20033 14.0801 7.10699 14.0801H9.64033C12.547 14.0801 14.0803 12.5467 14.0803 9.64008V7.10675C14.0937 4.20008 12.5603 2.66675 9.65366 2.66675Z"
                  fill="#2BA6A4"
                />
                <path
                  d="M9.65366 2.66675H7.12033C4.20033 2.66675 2.66699 4.20008 2.66699 7.10675V9.64008C2.66699 12.5467 4.20033 14.0801 7.10699 14.0801H9.64033C12.547 14.0801 14.0803 12.5467 14.0803 9.64008V7.10675C14.0937 4.20008 12.5603 2.66675 9.65366 2.66675Z"
                  fill="black"
                  fillOpacity="0.2"
                />
                <g opacity="0.4">
                  <path
                    d="M24.8933 2.66675H22.3599C19.4533 2.66675 17.9199 4.20008 17.9199 7.10675V9.64008C17.9199 12.5467 19.4533 14.0801 22.3599 14.0801H24.8933C27.7999 14.0801 29.3333 12.5467 29.3333 9.64008V7.10675C29.3333 4.20008 27.7999 2.66675 24.8933 2.66675Z"
                    fill="#2BA6A4"
                  />
                  <path
                    d="M24.8933 2.66675H22.3599C19.4533 2.66675 17.9199 4.20008 17.9199 7.10675V9.64008C17.9199 12.5467 19.4533 14.0801 22.3599 14.0801H24.8933C27.7999 14.0801 29.3333 12.5467 29.3333 9.64008V7.10675C29.3333 4.20008 27.7999 2.66675 24.8933 2.66675Z"
                    fill="black"
                    fillOpacity="0.2"
                  />
                </g>
                <path
                  d="M24.8933 17.9067H22.3599C19.4533 17.9067 17.9199 19.4401 17.9199 22.3467V24.8801C17.9199 27.7867 19.4533 29.3201 22.3599 29.3201H24.8933C27.7999 29.3201 29.3333 27.7867 29.3333 24.8801V22.3467C29.3333 19.4401 27.7999 17.9067 24.8933 17.9067Z"
                  fill="#2BA6A4"
                />
                <path
                  d="M24.8933 17.9067H22.3599C19.4533 17.9067 17.9199 19.4401 17.9199 22.3467V24.8801C17.9199 27.7867 19.4533 29.3201 22.3599 29.3201H24.8933C27.7999 29.3201 29.3333 27.7867 29.3333 24.8801V22.3467C29.3333 19.4401 27.7999 17.9067 24.8933 17.9067Z"
                  fill="black"
                  fillOpacity="0.2"
                />
                <path
                  opacity="0.4"
                  d="M9.65366 17.9067H7.12033C4.20033 17.9067 2.66699 19.4401 2.66699 22.3467V24.8801C2.66699 27.8001 4.20033 29.3334 7.10699 29.3334H9.64033C12.547 29.3334 14.0803 27.8001 14.0803 24.8934V22.3601C14.0937 19.4401 12.5603 17.9067 9.65366 17.9067Z"
                  fill="#145DA0"
                />
              </svg>
              <h2
                className="text-xl font-bold text-right"
                style={{ color: "#124645" }}
              >
                Edit Category
              </h2>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex h-12 py-3 items-center gap-2">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <g clipPath="url(#clip0_4222_25880)">
                <path
                  d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                  fill="#F0F0F0"
                />
                <path
                  d="M11.4775 12.0001H23.9993C23.9993 10.917 23.8549 9.86774 23.5859 8.86963H11.4775V12.0001Z"
                  fill="#D80027"
                />
                <path
                  d="M11.4775 5.7391H22.238C21.5034 4.54041 20.5642 3.48089 19.4691 2.60864H11.4775V5.7391Z"
                  fill="#D80027"
                />
                <path
                  d="M12.0001 23.9998C14.8243 23.9998 17.4201 23.0237 19.4699 21.3911H4.53027C6.58012 23.0237 9.17591 23.9998 12.0001 23.9998Z"
                  fill="#D80027"
                />
                <path
                  d="M1.76098 18.2608H22.2384C22.8281 17.2985 23.2855 16.2467 23.5863 15.1304H0.413086C0.713883 16.2467 1.17124 17.2985 1.76098 18.2608Z"
                  fill="#D80027"
                />
                <path
                  d="M5.55863 1.87397H6.65217L5.63498 2.61295L6.02353 3.80869L5.00639 3.0697L3.98925 3.80869L4.32487 2.7757C3.42928 3.52172 2.64431 4.39575 1.99744 5.36963H2.34783L1.70034 5.84002C1.59947 6.0083 1.50272 6.17925 1.41 6.35273L1.71919 7.30434L1.14234 6.88523C0.998953 7.18903 0.867797 7.49967 0.749906 7.81678L1.09055 8.86528H2.34783L1.33064 9.60427L1.71919 10.8L0.702047 10.061L0.0927656 10.5037C0.0317812 10.9939 0 11.4932 0 12H12C12 5.37262 12 4.59131 12 0C9.62944 0 7.41961 0.687656 5.55863 1.87397ZM6.02353 10.8L5.00639 10.061L3.98925 10.8L4.3778 9.60427L3.36061 8.86528H4.61789L5.00639 7.66955L5.39489 8.86528H6.65217L5.63498 9.60427L6.02353 10.8ZM5.63498 6.10861L6.02353 7.30434L5.00639 6.56536L3.98925 7.30434L4.3778 6.10861L3.36061 5.36963H4.61789L5.00639 4.17389L5.39489 5.36963H6.65217L5.63498 6.10861ZM10.3279 10.8L9.31073 10.061L8.29359 10.8L8.68214 9.60427L7.66495 8.86528H8.92223L9.31073 7.66955L9.69923 8.86528H10.9565L9.93933 9.60427L10.3279 10.8ZM9.93933 6.10861L10.3279 7.30434L9.31073 6.56536L8.29359 7.30434L8.68214 6.10861L7.66495 5.36963H8.92223L9.31073 4.17389L9.69923 5.36963H10.9565L9.93933 6.10861ZM9.93933 2.61295L10.3279 3.80869L9.31073 3.0697L8.29359 3.80869L8.68214 2.61295L7.66495 1.87397H8.92223L9.31073 0.678234L9.69923 1.87397H10.9565L9.93933 2.61295Z"
                  fill="#0052B4"
                />
              </g>
            </svg>
            <span className="text-gray-900 text-xl font-medium">English</span>
            <svg
              className="w-4 h-4 text-gray-900"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M11.9465 5.45337H7.79316H4.05317C3.41317 5.45337 3.09317 6.2267 3.5465 6.68004L6.99983 10.1334C7.55317 10.6867 8.45317 10.6867 9.0065 10.1334L10.3198 8.82004L12.4598 6.68004C12.9065 6.2267 12.5865 5.45337 11.9465 5.45337Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-start gap-6 w-full"
        >
          {/* Tour Category Title */}
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex items-center gap-6 w-full">
              <div className="flex flex-col items-end gap-1 flex-1">
                <label
                  className="w-full text-xl font-normal"
                  style={{ color: "#222E50" }}
                >
                  Tour Category Title
                </label>
                <div className="flex h-9 px-4 py-3 justify-end items-center gap-2 w-full border border-gray-200 rounded-lg bg-white">
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className="flex-1 text-gray-400 text-base font-normal outline-none border-none"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-6 w-full max-w-2xl">
            <span className="text-xl font-normal" style={{ color: "#222E50" }}>
              Tour Category Status
            </span>
            <div className="flex p-1 flex-col items-start gap-2.5 rounded border border-gray-300">
              <div className="flex items-center gap-2 w-full">
                <div className="flex justify-center items-center rounded bg-green-100 px-3 py-0.5">
                  <span className="text-center text-xs font-normal text-green-800">
                    Active
                  </span>
                </div>
                <div className="flex p-0.5 items-center gap-2.5 rounded">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.2797 5.96655L8.93306 10.3132C8.41973 10.8266 7.57973 10.8266 7.06639 10.3132L2.71973 5.96655"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeMiterlimit="10"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Cities */}
          <div className="flex flex-col items-start gap-4 w-full">
            <div className="flex flex-col justify-center items-end gap-6 w-full">
              <div className="flex items-center gap-6 w-full">
                <div className="flex flex-col items-end gap-1 w-full max-w-lg">
                  <label
                    className="w-full text-xl font-normal"
                    style={{ color: "#222E50" }}
                  >
                    Cities
                  </label>
                  <div className="flex flex-col items-start gap-2 w-full">
                    {cities.map((city) => (
                      <div key={city.id} className="flex items-center gap-1">
                        <div className="relative w-4 h-4">
                          <input
                            type="checkbox"
                            checked={formData.cities.includes(city.id)}
                            onChange={() => handleCityToggle(city.id)}
                            className="w-4 h-4 rounded border border-teal-700 bg-white appearance-none checked:bg-teal-700 checked:border-teal-700"
                          />
                          {formData.cities.includes(city.id) && (
                            <svg
                              className="absolute top-0 left-0 w-4 h-4 text-white pointer-events-none"
                              viewBox="0 0 16 16"
                              fill="none"
                            >
                              <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M13.7799 4.22007C13.9203 4.36069 13.9992 4.55132 13.9992 4.75007C13.9992 4.94882 13.9203 5.13944 13.7799 5.28007L6.52985 12.5301C6.38922 12.6705 6.1986 12.7494 5.99985 12.7494C5.8011 12.7494 5.61047 12.6705 5.46985 12.5301L2.21985 9.28007C2.08737 9.13789 2.01525 8.94985 2.01867 8.75554C2.0221 8.56124 2.10081 8.37586 2.23823 8.23844C2.37564 8.10103 2.56103 8.02232 2.75533 8.01889C2.94963 8.01546 3.13767 8.08759 3.27985 8.22007L5.99985 10.9401L12.7199 4.22007C12.8605 4.07962 13.0511 4.00073 13.2499 4.00073C13.4486 4.00073 13.6393 4.07962 13.7799 4.22007Z"
                                fill="#F3F3EE"
                              />
                            </svg>
                          )}
                        </div>
                        <span className="text-gray-400 text-center text-sm font-normal">
                          {city.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex px-0 py-4 items-center gap-4 w-full">
            <button
              type="button"
              onClick={onClose}
              className="flex px-4 py-2 justify-center items-center gap-3 flex-1 rounded border border-teal-700 bg-white hover:bg-gray-50 transition-colors"
              style={{ backgroundColor: "#F3F3EE" }}
            >
              <span
                className="text-xl font-semibold"
                style={{ color: "#1F7674" }}
              >
                Cancel
              </span>
            </button>
            <button
              type="submit"
              className="flex px-4 py-2 justify-center items-center gap-3 flex-1 rounded bg-teal-700 hover:bg-teal-800 transition-colors"
            >
              <span
                className="text-xl font-semibold"
                style={{ color: "#EAF6F6" }}
              >
                Save
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
