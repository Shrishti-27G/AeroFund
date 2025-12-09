import { Station } from "../models/stationsModel.js";
import { uploadImageToCloudinary } from "../config/imageUploader.js";

// export const getAllStations = async (req, res) => {
//   try {
//     const stations = await Station.find().select(
//       "_id stationName stationCode email totalAllocated totalUtilized totalEstimated remark receipt createdAt"
//     );

//     if (!stations || stations.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No stations found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       count: stations.length,
//       stations,
//     });

//   } catch (error) {
//     console.error("Get All Stations Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching stations",
//     });
//   }
// };


export const getStationByFinancialYear = async (req, res) => {
  try {
    const { stationCode, financialYear } = req.params;

    const station = await Station.findOne(
      {
        stationCode,
        "yearlyData.financialYear": financialYear,
      },
      {
        stationName: 1,
        stationCode: 1,
        email: 1,
        "yearlyData.$": 1, // ✅ Only matched financial year
      }
    );

    if (!station) {
      return res.status(404).json({
        success: false,
        message: "No data found for this financial year",
      });
    }

    res.status(200).json({
      success: true,
      station,
    });

  } catch (error) {
    console.error("Financial Year Fetch Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};





// export const updateYearlyBudget = async (req, res) => {
//   try {
//     const { stationCode, year } = req.params;
//     const { totalAllocated, totalUtilized, totalEstimated, remark, receipt } =
//       req.body;

//     console.log("Edit req -> ", req.body);


//     // ✅ BASIC VALIDATION
//     if (!stationCode || !year) {
//       return res.status(400).json({
//         message: "Station Code and Year are required",
//       });
//     }

//     const parsedYear = Number(year);

//     if (isNaN(parsedYear)) {
//       return res.status(400).json({
//         message: "Invalid year format",
//       });
//     }

//     // ✅ FIND STATION
//     const station = await Station.findOne({ stationCode });

//     if (!station) {
//       return res.status(404).json({
//         message: "Station not found",
//       });
//     }

//     // ✅ FIND EXISTING YEAR RECORD
//     let yearlyRecord = station.yearlyData.find(
//       (item) => item.year === parsedYear
//     );

//     // ✅ ✅ IF YEAR DOES NOT EXIST → CREATE IT
//     if (!yearlyRecord) {
//       const newYearRecord = {
//         year: parsedYear,
//         totalAllocated: totalAllocated ?? 0,
//         totalUtilized: totalUtilized ?? 0,
//         totalEstimated: totalEstimated ?? 0,
//         remark: remark ?? "N/A",
//         receipt: receipt ?? "Not Uploaded",
//       };

//       station.yearlyData.push(newYearRecord);
//       await station.save();

//       return res.status(201).json({
//         message: `Yearly budget created successfully for ${parsedYear}`,
//         createdYear: newYearRecord,
//         station,
//       });
//     }

//     // ✅ ✅ IF YEAR EXISTS → UPDATE ONLY PROVIDED FIELDS
//     if (totalAllocated !== undefined)
//       yearlyRecord.totalAllocated = totalAllocated;

//     if (totalUtilized !== undefined)
//       yearlyRecord.totalUtilized = totalUtilized;

//     if (totalEstimated !== undefined)
//       yearlyRecord.totalEstimated = totalEstimated;

//     if (remark !== undefined)
//       yearlyRecord.remark = remark;

//     if (receipt !== undefined)
//       yearlyRecord.receipt = receipt;

//     // ✅ SAVE UPDATED DATA
//     await station.save();

//     res.status(200).json({
//       message: "Yearly budget updated successfully",
//       updatedYear: yearlyRecord,
//       station,
//     });

//   } catch (error) {
//     console.error("Update/Create Yearly Budget Error:", error);
//     res.status(500).json({
//       message: "Server error while updating yearly budget",
//       error: error.message,
//     });
//   }
// };






// export const getAllStations = async (req, res) => {
//   try {
//     const stations = await Station.aggregate([
//       // ✅ Break yearlyData array
//       { $unwind: "$yearlyData" },

//       // ✅ Sort each station's yearly data by latest year FIRST
//       { $sort: { "yearlyData.year": -1 } },

//       // ✅ Group back to ONE document per station
//       {
//         $group: {
//           _id: "$_id",
//           stationName: { $first: "$stationName" },
//           stationCode: { $first: "$stationCode" },
//           email: { $first: "$email" },

//           // ✅ LATEST FINANCIAL YEAR DATA ONLY
//           financialYear: { $first: "$yearlyData.year" },
//           totalAllocated: { $first: "$yearlyData.totalAllocated" },
//           totalUtilized: { $first: "$yearlyData.totalUtilized" },
//           totalEstimated: { $first: "$yearlyData.totalEstimated" },
//           remark: { $first: "$yearlyData.remark" },
//           receipt: { $first: "$yearlyData.receipt" },

//           createdAt: { $first: "$createdAt" },
//           updatedAt: { $first: "$updatedAt" },
//         },
//       },

//       // ✅ Optional: sort stations alphabetically
//       { $sort: { stationName: 1 } },
//     ]);

//     if (!stations || stations.length === 0) {
//       return res.status(404).json({
//         success: false,
//         message: "No stations found",
//       });
//     }

//     res.status(200).json({
//       success: true,
//       count: stations.length,
//       stations,
//     });

//   } catch (error) {
//     console.error("Get All Stations Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching stations",
//     });
//   }
// };


// export const getAllStations = async (req, res) => {
//   try {
//     const { year } = req.query; // ✅ READ YEAR FROM QUERY
//     const filterYear = year ? Number(year) : null;

//     console.log("YEar -> ", req.query);


//     const pipeline = [];

//     // ✅ BREAK yearlyData ARRAY
//     pipeline.push({ $unwind: "$yearlyData" });

//     // ✅ IF YEAR IS PROVIDED → FILTER THAT YEAR
//     if (filterYear) {
//       pipeline.push({
//         $match: {
//           "yearlyData.year": filterYear,
//         },
//       });
//     }

//     // ✅ SORT LATEST FIRST (ONLY USED WHEN NO YEAR FILTER)
//     pipeline.push({
//       $sort: { "yearlyData.year": -1 },
//     });

//     // ✅ GROUP BACK TO ONE DOCUMENT PER STATION
//     pipeline.push({
//       $group: {
//         _id: "$_id",
//         stationName: { $first: "$stationName" },
//         stationCode: { $first: "$stationCode" },
//         email: { $first: "$email" },

//         // ✅ YEARLY DATA (FILTERED OR LATEST)
//         financialYear: { $first: "$yearlyData.year" },
//         totalAllocated: { $first: "$yearlyData.totalAllocated" },
//         totalUtilized: { $first: "$yearlyData.totalUtilized" },
//         totalEstimated: { $first: "$yearlyData.totalEstimated" },
//         remark: { $first: "$yearlyData.remark" },
//         receipt: { $first: "$yearlyData.receipt" },

//         createdAt: { $first: "$createdAt" },
//         updatedAt: { $first: "$updatedAt" },
//       },
//     });

//     // ✅ SORT STATIONS ALPHABETICALLY
//     pipeline.push({ $sort: { stationName: 1 } });

//     const stations = await Station.aggregate(pipeline);

//     if (!stations || stations.length === 0) {
//       return res.status(200).json({
//         success: true,
//         count: 0,
//         stations: [],
//       });
//     }

//     res.status(200).json({
//       success: true,
//       count: stations.length,
//       stations,
//     });

//   } catch (error) {
//     console.error("Get All Stations Error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching stations",
//     });
//   }
// };

export const updateYearlyBudget = async (req, res) => {
  try {
    const { stationCode, year } = req.params;
    const { totalAllocated, totalUtilized, totalEstimated, remark, description, allocationType } = req.body;

    console.log("Edit req body -> ", req.body);
    console.log("Edit req files -> ", req.files);


    // ✅ BASIC VALIDATION
    if (!stationCode || !year) {
      return res.status(400).json({
        message: "Station Code and Year are required",
      });
    }

    const parsedYear = Number(year);
    if (isNaN(parsedYear)) {
      return res.status(400).json({
        message: "Invalid year format",
      });
    }

    // ✅ FIND STATION
    const station = await Station.findOne({ stationCode });

    if (!station) {
      return res.status(404).json({
        message: "Station not found",
      });
    }

    // ✅ HANDLE RECEIPT IMAGE UPLOAD
    let receiptUrl = null;

    if (req.files && req.files.receipt) {
      const receiptFile = req.files.receipt;

      const uploadResult = await uploadImageToCloudinary(
        receiptFile,
        "station-receipts"
      );

      receiptUrl = uploadResult.secure_url;
    }

    // ✅ FIND EXISTING YEAR RECORD
    let yearlyRecord = station.yearlyData.find(
      (item) => item.year === parsedYear
    );

    // ✅ ✅ IF YEAR DOES NOT EXIST → CREATE IT
    if (!yearlyRecord) {
      const newYearRecord = {
        year: parsedYear,
        totalAllocated: totalAllocated ?? 0,
        totalUtilized: totalUtilized ?? 0,
        totalEstimated: totalEstimated ?? 0,
        remark: remark ?? "N/A",
        description: description ?? "N/A",
        allocationType: allocationType,

        // ✅ INIT RECEIPTS ARRAY
        receipts: receiptUrl ? [receiptUrl] : [],
      };

      station.yearlyData.push(newYearRecord);
      await station.save();

      return res.status(201).json({
        message: `Yearly budget created successfully for ${parsedYear}`,
        createdYear: newYearRecord,
        station,
      });
    }

    // ✅ ✅ IF YEAR EXISTS → UPDATE ONLY PROVIDED FIELDS
    if (totalAllocated !== undefined)
      yearlyRecord.totalAllocated = totalAllocated;

    if (totalUtilized !== undefined)
      yearlyRecord.totalUtilized = totalUtilized;

    if (totalEstimated !== undefined)
      yearlyRecord.totalEstimated = totalEstimated;

    if (description !== undefined) {
      yearlyRecord.description = description;
    }

    if (allocationType !== undefined) {
      yearlyRecord.allocationType = allocationType;
    }


    if (remark !== undefined)
      yearlyRecord.remark = remark;

    // ✅ ✅ APPEND NEW RECEIPT (DO NOT REPLACE)
    if (receiptUrl) {
      if (!yearlyRecord.receipts) {
        yearlyRecord.receipts = [];
      }
      yearlyRecord.receipts.push(receiptUrl); // ✅ KEEP OLD + ADD NEW
    }

    // ✅ SAVE UPDATED DATA
    await station.save();

    res.status(200).json({
      message: "Yearly budget updated successfully",
      updatedYear: yearlyRecord,
      station,
    });
  } catch (error) {
    console.error("Update/Create Yearly Budget Error:", error);
    res.status(500).json({
      message: "Server error while updating yearly budget",
      error: error.message,
    });
  }
};





export const getAllStations = async (req, res) => {
  try {
    const { year } = req.query; // ✅ READ YEAR FROM QUERY
    const filterYear = year ? Number(year) : null;

    const pipeline = [];

    // ✅ IF YEAR IS PROVIDED → PICK THAT YEAR FROM yearlyData
    if (filterYear) {
      pipeline.push({
        $addFields: {
          yearlyDataFiltered: {
            $filter: {
              input: "$yearlyData",
              as: "yd",
              cond: { $eq: ["$$yd.year", filterYear] },
            },
          },
        },
      });
    }

    // ✅ IF NO YEAR → PICK LATEST YEAR
    if (!filterYear) {
      pipeline.push({ $unwind: "$yearlyData" });
      pipeline.push({ $sort: { "yearlyData.year": -1 } });
    }

    // ✅ FINAL SHAPE (ALWAYS RETURN STATION)
    pipeline.push({
      $project: {
        stationName: 1,
        stationCode: 1,
        email: 1,
        createdAt: 1,
        updatedAt: 1,


        description: {
          $cond: [
            { $gt: [{ $size: "$yearlyDataFiltered" }, 0] },
            {
              $ifNull: [
                { $arrayElemAt: ["$yearlyDataFiltered.description", 0] },
                ""
              ]
            },
            ""
          ]
        },

        allocationType: {
          $cond: [
            { $gt: [{ $size: "$yearlyDataFiltered" }, 0] },
            { $arrayElemAt: ["$yearlyDataFiltered.allocationType", 0] },
            "N/A",
          ],
        },

        financialYear: {
          $cond: [
            { $ifNull: [filterYear, false] },
            filterYear,
            "$yearlyData.year",
          ],
        },

        totalAllocated: {
          $cond: [
            { $gt: [{ $size: "$yearlyDataFiltered" }, 0] },
            { $arrayElemAt: ["$yearlyDataFiltered.totalAllocated", 0] },
            0,
          ],
        },

        totalUtilized: {
          $cond: [
            { $gt: [{ $size: "$yearlyDataFiltered" }, 0] },
            { $arrayElemAt: ["$yearlyDataFiltered.totalUtilized", 0] },
            0,
          ],
        },

        totalEstimated: {
          $cond: [
            { $gt: [{ $size: "$yearlyDataFiltered" }, 0] },
            { $arrayElemAt: ["$yearlyDataFiltered.totalEstimated", 0] },
            0,
          ],
        },

        remark: {
          $cond: [
            { $gt: [{ $size: "$yearlyDataFiltered" }, 0] },
            { $arrayElemAt: ["$yearlyDataFiltered.remark", 0] },
            "N/A",
          ],
        },


        receipts: {
          $cond: [
            { $gt: [{ $size: "$yearlyDataFiltered" }, 0] },
            {
              $ifNull: [
                { $arrayElemAt: ["$yearlyDataFiltered.receipts", 0] },
                [],
              ],
            },
            [],
          ],
        },

      },
    });

    // ✅ SORT STATIONS ALPHABETICALLY
    pipeline.push({ $sort: { stationName: 1 } });

    const stations = await Station.aggregate(pipeline);

    res.status(200).json({
      success: true,
      count: stations.length,
      stations,
    });

  } catch (error) {
    console.error("Get All Stations Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error while fetching stations",
    });
  }
};
