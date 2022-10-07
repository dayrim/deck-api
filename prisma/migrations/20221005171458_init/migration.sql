-- CreateEnum
CREATE TYPE "Suit" AS ENUM ('DIAMONDS', 'CLUBS', 'HEARTS', 'SPADES');

-- CreateEnum
CREATE TYPE "DeckType" AS ENUM ('FULL', 'SHORT');

-- CreateTable
CREATE TABLE "Deck" (
    "id" TEXT NOT NULL,
    "shuffled" BOOLEAN NOT NULL DEFAULT false,
    "remaining" INTEGER NOT NULL DEFAULT 0,
    "type" "DeckType" NOT NULL DEFAULT 'FULL',

    CONSTRAINT "Deck_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Card" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "suit" "Suit" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeckToCard" (
    "deckId" TEXT NOT NULL,
    "cardId" TEXT NOT NULL,
    "positionInDeck" INTEGER NOT NULL,

    CONSTRAINT "DeckToCard_pkey" PRIMARY KEY ("deckId","cardId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_code_key" ON "Card"("code");

-- CreateIndex
CREATE UNIQUE INDEX "DeckToCard_deckId_positionInDeck_key" ON "DeckToCard"("deckId", "positionInDeck");

-- AddForeignKey
ALTER TABLE "DeckToCard" ADD CONSTRAINT "DeckToCard_deckId_fkey" FOREIGN KEY ("deckId") REFERENCES "Deck"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeckToCard" ADD CONSTRAINT "DeckToCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
