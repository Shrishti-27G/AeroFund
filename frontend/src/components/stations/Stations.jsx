import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createStation,
  getAllStations,
  updateYearlyBudget,
} from "../../services/operations/stationsOperations.js";

/* ✅ RETURN NUMBER YEAR */
const getCurrentFinancialYear = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  return month >= 4 ? year : year - 1;
};

/* ✅ FORMAT FOR UI */
const formatFY = (year) => `${year}-${year + 1}`;

const Stations = () => {
  const dispatch = useDispatch();

  const [stations, setStations] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [editStation, setEditStation] = useState(null);
  const [viewReceipt, setViewReceipt] = useState(null);
  const [receiptList, setReceiptList] = useState([]);
  const [viewReceiptIndex, setViewReceiptIndex] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(0);


  /* ✅ DEFAULT LATEST FY ON LOAD */
  const [selectedFY, setSelectedFY] = useState(getCurrentFinancialYear());

  const [formData, setFormData] = useState({
    stationName: "",
    stationCode: "",
    email: "",
    password: "",
    financialYear: getCurrentFinancialYear(),
  });

  const [editForm, setEditForm] = useState({
    totalAllocated: "",
    totalUtilized: "",
    totalEstimated: "",
    remark: "",
    receipt: "",
  });

  const [loading, setLoading] = useState(false);

  /* ✅ FETCH ON FIRST LOAD + FY CHANGE */
  useEffect(() => {
    fetchStations();
  }, [selectedFY]);

  const fetchStations = async () => {
    const res = await dispatch(getAllStations(selectedFY));

    if (Array.isArray(res)) {
      setStations(res);
    } else if (res?.stations && Array.isArray(res.stations)) {
      setStations(res.stations);
    } else {
      setStations([]);
    }
  };

  /* ✅ CREATE STATION */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await dispatch(
      createStation(
        formData.stationName,
        formData.stationCode,
        formData.password,
        formData.email,
        Number(formData.financialYear)
      )
    );

    if (result) {
      setOpenModal(false);
      fetchStations();
    }

    setLoading(false);
  };

  /* ✅ UPDATE / CREATE BUDGET */
  // const handleEditSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!editStation) return;

  //   const payload = {
  //     totalAllocated: Number(editForm.totalAllocated),
  //     totalUtilized: Number(editForm.totalUtilized),
  //     totalEstimated: Number(editForm.totalEstimated),
  //     receipt: editForm.receipt || "",
  //   };

  //   const result = await dispatch(
  //     updateYearlyBudget(editStation.stationCode, selectedFY, payload)
  //   );

  //   if (result) {
  //     setOpenEditModal(false);
  //     fetchStations();
  //   }
  // };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editStation) return;

    // ✅ MUST BE FormData (but variable name still "payload")
    const payload = new FormData();

    payload.append("totalAllocated", editForm.totalAllocated);
    payload.append("totalUtilized", editForm.totalUtilized);
    payload.append("totalEstimated", editForm.totalEstimated);

    // ✅ THIS IS THE REAL FILE
    if (editForm.receipt instanceof File) {
      payload.append("receipt", editForm.receipt);
    }

    const result = await dispatch(
      updateYearlyBudget(editStation.stationCode, selectedFY, payload)
    );

    if (result) {
      setOpenEditModal(false);
      fetchStations();
    }
  };



  const baseInputClass =
    "w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/15 text-sm text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400/70 focus:border-blue-400/70 transition";

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#1e293b_0,_#020617_45%,_#000_100%)] text-slate-50">
      {/* TOP GLOW / DECOR */}
      <div className="pointer-events-none fixed inset-x-0 top-0 h-40 bg-gradient-to-b from-blue-500/30 via-transparent to-transparent blur-3xl opacity-60" />

      <div className="relative  max-w-[95%] mx-auto px-4 py-8 sm:py-10 lg:py-12">
        {/* HEADER + FY FILTER BAR */}
        <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 border border-white/10 shadow-sm shadow-black/40 backdrop-blur-xl">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.2em] text-slate-300/80">
                AeroFund · Control Panel
              </span>
            </div>
            <h1 className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-slate-50">
              Stations Overview
            </h1>
            <p className="mt-2 text-sm sm:text-base text-slate-300/80">
              Manage yearly budgets for all stations with a clean, liquid-glass
              interface.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            {/* FY DROPDOWN */}
            <div className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/15 px-3 py-2 backdrop-blur-xl shadow-sm shadow-black/40">
              <span className="text-xs text-slate-300/80">Financial Year</span>
              <select
                value={selectedFY}
                onChange={(e) => setSelectedFY(Number(e.target.value))}
                className="bg-transparent text-sm text-slate-50 border-none focus:outline-none focus:ring-0 cursor-pointer"
              >
                <option
                  value={getCurrentFinancialYear()}
                  className="bg-slate-900"
                >
                  {formatFY(getCurrentFinancialYear())} (Current)
                </option>
                <option value={2024} className="bg-slate-900">
                  2024-2025
                </option>
                <option value={2023} className="bg-slate-900">
                  2023-2024
                </option>
              </select>
            </div>

            {/* CREATE BUTTON */}
            <button
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-sky-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/40 hover:shadow-blue-400/60 hover:scale-[1.02] active:scale-[0.99] transition-transform"
            >
              <span className="mr-1.5 ">＋</span>
              New Station
            </button>
          </div>
        </div>

        {/* STATIONS GRID */}
        {stations.length === 0 ? (
          <div className="mt-12 flex justify-center">
            <div className="rounded-3xl border border-dashed border-slate-600/60 bg-slate-900/40 px-6 py-10 text-center backdrop-blur-xl max-w-md">
              <p className="text-sm text-slate-300/80">
                No stations found yet. Create your first station to start
                managing budgets.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {stations.map((station) => {
              const hasBudget =
                Number(station.financialYear) === Number(selectedFY);

              return (
                <div
                  key={station._id}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-5 py-5 shadow-[0_18px_45px_rgba(15,23,42,0.7)] backdrop-blur-2xl transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_25px_60px_rgba(56,189,248,0.45)]"
                >
                  {/* Soft highlight background */}
                  <div className="pointer-events-none absolute inset-x-0 -top-16 h-32 bg-gradient-to-b from-sky-400/40 via-transparent to-transparent opacity-70 blur-3xl" />

                  <div className="relative flex flex-col items-start gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-slate-400/80">
                        {station.stationCode}
                      </p>
                      <h3 className="mt-1 text-base font-semibold text-slate-50">
                        {station.stationName}
                      </h3>
                      <p className="mt-1 text-[11px] text-slate-400">
                        {station.email}
                      </p>
                    </div>

                    <div className="rounded-full bg-slate-900/50 px-2.5 py-1 text-[12px] text-slate-300 border border-white/10">
                      FY {formatFY(selectedFY)}
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-slate-950/40 border border-white/5 px-3 py-3 text-xs text-slate-200 space-y-1.5">
                    {hasBudget ? (
                      <>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Allocated</span>
                          <span className="font-medium text-sky-300">
                            ₹{station.totalAllocated}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Utilized</span>
                          <span className="font-medium text-emerald-300">
                            ₹{station.totalUtilized}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Estimated</span>
                          <span className="font-medium text-violet-300">
                            ₹{station.totalEstimated}
                          </span>
                        </div>

                        <p className="pt-1 text-[11px] text-sky-200">
                          Remark:{" "}
                          <span className="font-medium text-slate-100">
                            {station.remark}
                          </span>
                        </p>

                     
                        <p className="text-[11px] text-indigo-200/90 flex items-start justify-between gap-2">
                          <span>
                            Receipts:{" "}
                            <span className="font-medium text-slate-100">
                              {station.receipts && station.receipts.length > 0
                                ? `Available (${station.receipts.length})`
                                : "Not Uploaded"}
                            </span>
                          </span>

                          {station.receipts && station.receipts.length > 0 && (
                            <button
                              onClick={() => {
                                setReceiptList(station.receipts); // ✅ poori list modal ko
                                setViewReceiptIndex(0);           // ✅ pehli image se start
                              }}
                              className="rounded-full bg-indigo-500/20 px-3 py-1 text-[10px] font-semibold text-indigo-200 border border-indigo-400/30 hover:bg-indigo-500/30 transition"
                            >
                              View
                            </button>
                          )}
                        </p>



                      </>
                    ) : (
                      <p className="py-3 text-center text-[11px] text-rose-300">
                        ❌ Budget not present for {formatFY(selectedFY)}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => {
                      setEditStation(station);
                      setEditForm({
                        totalAllocated: hasBudget ? station.totalAllocated : "",
                        totalUtilized: hasBudget ? station.totalUtilized : "",
                        totalEstimated: hasBudget ? station.totalEstimated : "",
                        remark: station.remark || "N/A",
                        receipt: station.receipt || "",
                      });
                      setOpenEditModal(true);
                    }}
                    className="relative mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white/10 px-3.5 py-2.5 text-xs font-semibold text-slate-50 border border-white/20 hover:bg-white/20 hover:border-sky-300/60 transition"
                  >
                    {hasBudget ? "Edit Budget" : "Add Budget"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* ✅ CREATE STATION MODAL */}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-950/60 px-7 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-x-10 -top-16 h-32 bg-gradient-to-b from-sky-400/40 via-transparent to-transparent blur-3xl" />

              <div className="relative flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-50">
                    Create Station
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    Add a new station with its starting financial year.
                  </p>
                </div>
                <button
                  onClick={() => setOpenModal(false)}
                  className="rounded-full bg-white/5 p-1.5 text-slate-300 hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSubmit} className="relative space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Station Name
                  </label>
                  <input
                    type="text"
                    value={formData.stationName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stationName: e.target.value,
                      })
                    }
                    className={baseInputClass}
                    placeholder="Eg. Mumbai International Airport"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Station Code
                  </label>
                  <input
                    type="text"
                    value={formData.stationCode}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        stationCode: e.target.value.toUpperCase(),
                      })
                    }
                    className={baseInputClass}
                    placeholder="Eg. BOMB"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Official Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className={baseInputClass}
                    placeholder="station@airport.com"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Password
                  </label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        password: e.target.value,
                      })
                    }
                    className={baseInputClass}
                    placeholder="Minimum 6 characters"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Financial Year
                  </label>
                  <select
                    value={formData.financialYear}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        financialYear: Number(e.target.value),
                      })
                    }
                    className={`${baseInputClass} bg-slate-900/60`}
                  >
                    <option
                      value={getCurrentFinancialYear()}
                      className="bg-slate-900"
                    >
                      {formatFY(getCurrentFinancialYear())} (Current)
                    </option>
                    <option value={2024} className="bg-slate-900">
                      2024-2025
                    </option>
                    <option value={2023} className="bg-slate-900">
                      2023-2024
                    </option>
                  </select>
                </div>

                <div className="mt-3 flex gap-3 pt-1">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 rounded-2xl bg-gradient-to-r from-blue-500 to-sky-400 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/40 hover:shadow-blue-400/70 hover:scale-[1.01] active:scale-[0.99] transition"
                  >
                    {loading ? "Creating…" : "Create Station"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setOpenModal(false)}
                    className="flex-1 rounded-2xl border border-white/15 bg-white/5 py-2.5 text-sm font-medium text-slate-100 hover:bg-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ✅ EDIT MODAL */}
        {openEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-slate-950/60 px-7 py-7 shadow-[0_22px_70px_rgba(15,23,42,0.9)] backdrop-blur-2xl">
              <div className="pointer-events-none absolute inset-x-10 -top-16 h-32 bg-gradient-to-b from-emerald-400/40 via-transparent to-transparent blur-3xl" />

              <div className="relative flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold text-slate-50">
                    Budget · {editStation?.stationCode}
                  </h2>
                  <p className="mt-1 text-xs text-slate-400">
                    {editStation?.stationName} · {formatFY(selectedFY)}
                  </p>
                </div>
                <button
                  onClick={() => setOpenEditModal(false)}
                  className="rounded-full bg-white/5 p-1.5 text-slate-300 hover:bg-white/10"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="relative space-y-4">
                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Total Allocated (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    value={editForm.totalAllocated}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        totalAllocated: e.target.value,
                      })
                    }
                    className={baseInputClass}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Total Utilized (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    value={editForm.totalUtilized}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        totalUtilized: e.target.value,
                      })
                    }
                    className={baseInputClass}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Total Estimated (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    onKeyDown={(e) => {
                      if (e.key === "-" || e.key === "e") e.preventDefault();
                    }}
                    value={editForm.totalEstimated}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        totalEstimated: e.target.value,
                      })
                    }
                    className={baseInputClass}
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs text-slate-300">
                    Remark (read only)
                  </label>
                  <input
                    value={editForm.remark}
                    readOnly
                    className="w-full px-4 py-3 rounded-2xl bg-slate-900/80 border border-white/10 text-sm text-slate-200 cursor-not-allowed"
                  />
                </div>

                <div className="relative w-full">

                  {/* ✅ UPLOAD BOX */}
                  <label className="relative flex flex-col items-center justify-center w-full h-32 sm:h-36 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer bg-white/5 hover:bg-white/10 transition group overflow-hidden">

                    {/* ✅ IMAGE PREVIEW */}
                    {editForm.receipt ? (
                      <>
                        <img
                          src={URL.createObjectURL(editForm.receipt)}
                          alt="Preview"
                          className="absolute inset-0 h-full w-full object-cover rounded-2xl"
                        />

                        {/* ✅ DARK OVERLAY */}
                        <div className="absolute inset-0 bg-black/40"></div>

                        {/* ✅ CHANGE FILE */}
                        <p className="relative z-10 text-xs text-slate-200 font-semibold">
                          Click to change image
                        </p>
                      </>
                    ) : (
                      <>
                        {/* ✅ ICON */}
                        <svg
                          className="w-7 h-7 mb-1 text-slate-300 group-hover:text-sky-300 transition"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 16v-8m0 0l-3 3m3-3l3 3M4 16.5a4.5 4.5 0 010-9h.75a5.25 5.25 0 0110.5 0H20a4 4 0 010 8h-8"
                          />
                        </svg>

                        <p className="text-xs text-slate-300 text-center">
                          <span className="font-semibold text-slate-100">Click to upload</span> or drag & drop
                          <br />
                          PNG, JPG (max 10MB)
                        </p>
                      </>
                    )}

                    {/* ✅ HIDDEN INPUT */}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        setEditForm({
                          ...editForm,
                          receipt: e.target.files[0],
                        });
                        setUploadProgress(0); // ✅ reset progress
                      }}
                    />
                  </label>

                  {/* ✅ FILE NAME + REMOVE BUTTON */}
                  {editForm.receipt && (
                    <div className="mt-2 flex items-center justify-between gap-2">
                      <p className="text-[11px] text-emerald-300 truncate">
                        {editForm.receipt.name}
                      </p>

                      {/* ✅ REMOVE FILE */}
                      <button
                        type="button"
                        onClick={() => {
                          setEditForm({ ...editForm, receipt: null });
                          setUploadProgress(0);
                        }}
                        className="rounded-full bg-rose-500/20 px-3 py-1 text-[10px] font-semibold text-rose-300 border border-rose-400/30 hover:bg-rose-500/30 transition"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {/* ✅ UPLOAD PROGRESS BAR */}
                  {uploadProgress > 0 && (
                    <div className="mt-2 w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-sky-400 to-emerald-400 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                  )}

                  {/* ✅ PROGRESS TEXT */}
                  {uploadProgress > 0 && (
                    <p className="mt-1 text-[10px] text-slate-300 text-center">
                      Uploading… {uploadProgress}%
                    </p>
                  )}
                </div>


                <button className="mt-2 w-full rounded-2xl bg-gradient-to-r from-emerald-400 to-sky-400 py-2.5 text-sm font-semibold text-slate-950 shadow-md shadow-emerald-400/40 hover:shadow-emerald-300/60 hover:scale-[1.01] active:scale-[0.99] transition">
                  Save Budget
                </button>
              </form>
            </div>
          </div>
        )}


        {/* ✅ RECEIPT VIEW MODAL */}
        {receiptList.length > 0 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="relative w-[95%] max-w-2xl rounded-3xl border border-white/15 bg-slate-950/80 p-5 shadow-[0_22px_70px_rgba(15,23,42,0.9)]">

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-slate-100">
                  Receipt {viewReceiptIndex + 1} of {receiptList.length}
                </h3>

                <button
                  onClick={() => {
                    setReceiptList([]);
                    setViewReceiptIndex(0);
                  }}
                  className="rounded-full bg-white/10 px-3 py-1 text-xs text-slate-200 hover:bg-white/20"
                >
                  ✕
                </button>
              </div>

              {/* ✅ IMAGE PREVIEW */}
              <div className="flex justify-center mb-4">
                <img
                  src={receiptList[viewReceiptIndex]}
                  alt="Receipt"
                  className="max-h-[70vh] rounded-xl object-contain border border-white/10"
                />
              </div>

              {/* ✅ MODAL KE ANDAR HI PREV / NEXT + OPEN + DOWNLOAD */}
              <div className="flex flex-wrap items-center justify-center gap-3">

                {/* PREVIOUS */}
                <button
                  disabled={viewReceiptIndex === 0}
                  onClick={() => setViewReceiptIndex((prev) => prev - 1)}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-xs text-slate-200 disabled:opacity-40"
                >
                  ◀ Prev
                </button>

                {/* NEXT */}
                <button
                  disabled={viewReceiptIndex === receiptList.length - 1}
                  onClick={() => setViewReceiptIndex((prev) => prev + 1)}
                  className="rounded-full bg-white/10 px-4 py-1.5 text-xs text-slate-200 disabled:opacity-40"
                >
                  Next ▶
                </button>

                {/* OPEN */}
                <a
                  href={receiptList[viewReceiptIndex]}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full bg-sky-500/20 px-4 py-1.5 text-xs font-semibold text-sky-300 border border-sky-400/30 hover:bg-sky-500/30 transition"
                >
                  Open in New Tab
                </a>

                {/* DOWNLOAD INFO */}

                {/* ✅ DESKTOP ONLY */}
                <p className="hidden sm:block text-xs text-slate-300 mt-2 text-center leading-relaxed">
                  Right click on the image and select{" "}
                  <span className="font-semibold text-slate-100">"Save Image As"</span>
                </p>

                {/* ✅ MOBILE ONLY */}
                <p className="block sm:hidden text-xs text-slate-300 mt-2 text-center leading-relaxed">

                  <span className="font-semibold text-slate-100">
                    Touch & hold the image
                  </span>{" "}
                  to get the download option.
                </p>


              </div>
            </div>
          </div>
        )}





      </div>
    </div>
  );
};

export default Stations;
