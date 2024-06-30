export class Notification {
    date: string
    title?: string
    message?: string
    isError: boolean = false

    constructor(message?: string, title?: string, isError?: boolean) {
        this.date = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
        })
        this.title = title
        this.message = message
        this.isError = isError ?? false
    }
}
