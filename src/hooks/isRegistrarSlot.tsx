

const dayNumber = (d: Date) =>
    Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);


export function isRegistrarSlot(date: string) {
    const activeDate = new Date(date)
    const ANCHOR = new Date(2026, 8, 30); // a Wednesday: start of the cycle
    const SLOT_OFFSETS = [0, 3, 8];     // Wed (wk1), Sat (wk1), Thu (wk2)

    const diff = dayNumber(activeDate) - dayNumber(ANCHOR);
    const pos = ((diff % 14) + 14) % 14; // handles dates before the anchor

    return SLOT_OFFSETS.includes(pos);
}