/*
  Warnings:

  - Added the required column `prosong` to the `Song` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "key" TEXT,
    "tempo" TEXT,
    "time" TEXT,
    "ccli" TEXT,
    "prosong" TEXT NOT NULL
);
INSERT INTO "new_Song" ("artist", "ccli", "id", "key", "tempo", "time", "title") SELECT "artist", "ccli", "id", "key", "tempo", "time", "title" FROM "Song";
DROP TABLE "Song";
ALTER TABLE "new_Song" RENAME TO "Song";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
