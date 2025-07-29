export class Event {
    private event_place: string;
    private event_date: Date;
    private event_folder: string;

    public constructor(event_place: string, event_date: any, event_folder: string) {
        this.event_place = event_place;
        this.event_date = new Date(event_date);
        this.event_folder = event_folder;
    }

    public getEventPlace(): string {
        return this.event_place;
    }

    public getEventDate(): Date {
        return this.event_date;
    }

    public getEventDateStr(): string {
        return this.event_date.toISOString().split('T')[0];
    }

    public getEventFolder(): string {
        return this.event_folder;
    }
}