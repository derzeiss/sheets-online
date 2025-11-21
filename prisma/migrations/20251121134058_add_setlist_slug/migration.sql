/*
  Warnings:

  - Added the required column `slug` to the `Setlist` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Setlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "songAmount" INTEGER NOT NULL
);
INSERT INTO "new_Setlist" ("id", "slug", "name", "songAmount") SELECT "id", "id", "name", "songAmount" FROM "Setlist";
DROP TABLE "Setlist";
ALTER TABLE "new_Setlist" RENAME TO "Setlist";
CREATE UNIQUE INDEX "Setlist_slug_key" ON "Setlist"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
