export class Notification {
    date: string
    message: string
    isError: boolean = false

    constructor(message: string, isError?: boolean) {
        this.date = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })
        this.message = message
        this.isError = isError ?? false
    }
}
