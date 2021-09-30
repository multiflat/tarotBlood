export interface CardsTimePeriod {
    timeStamp: Date,
    threeCards: number[],
    isCardSelected: Boolean,
    selectedCard: number,
    periodDays: number,
    firstDay: Date
}