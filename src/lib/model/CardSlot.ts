export default class CardSlot {
    /**
     * The format of the slot. This can be "plaintext" or "wordPacks".
     */
    format: string = "plaintext";
    value: string = "";

    toJSON(): string {
        return JSON.stringify({
            format: this.format,
            value: this.value,
        });
    }

    static fromJSON(serialized: string): CardSlot {
        return JSON.parse(serialized);
    }

    static plaintext(value: string | undefined): CardSlot {
        const slot = new CardSlot();
        slot.format = "plaintext";
        slot.value = value ?? "";
        return slot;
    }

    static wordPacks(wordPackIds: string[] | undefined): CardSlot {
        const slot = new CardSlot();
        slot.format = "wordPacks";
        slot.value = wordPackIds?.filter((id) => id)?.join(",") ?? "";
        return slot;
    }
}