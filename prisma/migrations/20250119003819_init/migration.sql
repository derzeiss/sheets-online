-- CreateTable
CREATE TABLE "Song" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "artist" TEXT,
    "key" TEXT,
    "tempo" TEXT,
    "time" TEXT,
    "ccli" TEXT
);

-- CreateTable
CREATE TABLE "Setlist" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SongsOnSetlist" (
    "songId" TEXT NOT NULL,
    "setlistId" TEXT NOT NULL,

    PRIMARY KEY ("songId", "setlistId"),
    CONSTRAINT "SongsOnSetlist_songId_fkey" FOREIGN KEY ("songId") REFERENCES "Song" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SongsOnSetlist_setlistId_fkey" FOREIGN KEY ("setlistId") REFERENCES "Setlist" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
