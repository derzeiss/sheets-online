-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "key" TEXT,
    "tempo" TEXT,
    "time" TEXT,
    "ccli" TEXT,
    "prosong" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Setlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "songAmount" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "SongsOnSetlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "songId" TEXT NOT NULL,
    "setlistId" TEXT NOT NULL,
    "key" TEXT,
    "order" INTEGER NOT NULL,
    CONSTRAINT "SongsOnSetlist_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SongsOnSetlist_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "Setlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
