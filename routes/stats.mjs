import express from "express";
import db from "../db/conn.mjs";
import { ObjectId } from "mongodb";


const router = express.Router();

/**
 * It is not best practice to separate these routes
 * like we have done here. This file was created
 * specifically for educational purposes, to contain
 * all aggregation routes in one place.
 */

/**
 * Grading Weights by Score Type:
 * - Exams: 50%
 * - Quizzes: 30%
 * - Homework: 20%
 */

// Get the weighted average of a specified learner's grades, per class
router.get("/stats", async (req, res) => {
  let collection = await db.collection("grades");

  let result = await collection.aggregate(
    [
      {
        $project: {
          avg_score: { $avg: '$scores.score' },
          student_id: 1
        }
      },
      { $sort: { avg_score: -1 } },
      { $match: { avg_score: { $gte: 70 } } },
      { $sort: { avg_score: 1 } },
      { $count: 'string' }
    ],
    { maxTimeMS: 60000, allowDiskUse: true }
  ).toArray();

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});

export default router;
