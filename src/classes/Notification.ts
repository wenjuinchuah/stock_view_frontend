export class Notification {
    date: string
    message: string
    isError: boolean = false

    constructor(date: string, message: string, isError: boolean) {
        this.date = date
        this.message = message
        this.isError = isError
    }
}
