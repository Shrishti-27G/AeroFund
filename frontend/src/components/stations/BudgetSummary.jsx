import React from "react";

/* ✅ FORMAT FY */
const formatFY = (year) => `${year}-${year + 1}`;

/* ✅ FORMAT LARGE NUMBERS INTO INDIAN SYSTEM (1,00,000 etc.) */
const formatINR = (num) => {
  if (num === null || num === undefined) return "0";

  // Prevent wrong formatting for extremely large numbers
  if (num > 1e15) return num.toExponential(2);

  return Number(num).toLocaleString("en-IN");
};

const BudgetSummary = ({ stations, selectedFY }) => {
  // ✅ CALCULATIONS
  const totalAllocated = stations.reduce(
    (sum, s) => sum + Number(s.totalAllocated || 0),
    0
  );

  const totalUtilized = stations.reduce(
    (sum, s) => sum + Number(s.totalUtilized || 0),
    0
  );

  const totalEstimated = stations.reduce(
    (sum, s) => sum + Number(s.totalEstimated || 0),
    0
  );

  const utilizationPercent =
    totalAllocated > 0
      ? ((totalUtilized / totalAllocated) * 100).toFixed(1)
      : 0;

  return (
    <div
      className="
        mb-8 sm:mb-10
        w-full max-w-full
        rounded-2xl sm:rounded-3xl
        border border-white/10
        bg-slate-950/70
        shadow-[0_15px_40px_rgba(15,23,42,0.6)]
        backdrop-blur-2xl
        overflow-hidden
      "
    >
      {/* TITLE */}
      <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-white/10">
        <h2
          className="
            text-xs sm:text-sm md:text-base
            font-semibold
            text-slate-50
            tracking-wide
            leading-snug
          "
        >
          Budget Utilization Summary Report : {formatFY(selectedFY)}
        </h2>
      </div>

      {/* SUMMARY TABLE */}
      <div className="overflow-x-auto">
        <table
          className="
            w-full
            border-collapse
            text-[11px] sm:text-xs md:text-sm
            text-slate-200
          "
        >
          <tbody>
            <tr className="border-b border-white/10">
              <td
                className="
                  px-3 sm:px-4
                  py-2.5 sm:py-3
                  font-medium
                  text-slate-300
                  w-[65%] sm:w-[70%]
                "
              >
                Total Budget Allocated to Stations
              </td>
              <td
                className="
                  px-3 sm:px-4
                  py-2.5 sm:py-3
                  font-semibold
                  text-sky-300
                  text-right
                  whitespace-nowrap
                "
              >
                ₹{formatINR(totalAllocated)}
              </td>
            </tr>

            <tr className="border-b border-white/10">
              <td
                className="
                  px-3 sm:px-4
                  py-2.5 sm:py-3
                  font-medium
                  text-slate-300
                "
              >
                Total Budget Utilized till date
              </td>
              <td
                className="
                  px-3 sm:px-4
                  py-2.5 sm:py-3
                  font-semibold
                  text-emerald-300
                  text-right
                  whitespace-nowrap
                "
              >
                ₹{formatINR(totalUtilized)}
              </td>
            </tr>

            <tr>
              <td
                className="
                  px-3 sm:px-4
                  py-2.5 sm:py-3
                  font-medium
                  text-slate-300
                "
              >
                Budget Utilization till date
              </td>
              <td
                className="
                  px-3 sm:px-4
                  py-2.5 sm:py-3
                  font-semibold
                  text-violet-300
                  text-right
                  whitespace-nowrap
                "
              >
                {utilizationPercent} %
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BudgetSummary;
