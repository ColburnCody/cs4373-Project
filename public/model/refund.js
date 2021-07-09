export class Refund {
    constructor(data) {
        this.uid = data.uid;
        this.items = data.items;
    }

    serialize(timestamp) {
        return {
            uid: this.uid,
            items: this.items,
            timestamp,
        };

    }
}