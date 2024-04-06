type State = 'idle' | 'busy' | 'error'

export class StoreStatus {
    private state: State = 'idle'
    error: string = ''

    isIdle(): boolean {
        return this.state === 'idle'
    }

    isBusy(): boolean {
        return this.state === 'busy'
    }

    isError(): boolean {
        return this.state === 'error'
    }

    setIdle(): void {
        this.state = 'idle'
    }

    setBusy(): void {
        this.state = 'busy'
    }

    setError(error: string): void {
        this.state = 'error'
        this.error = error
    }

    getError(): string {
        if (this.isError()) {
            return this.error
        }
        return ''
    }

    constructor(state?: State) {
        if (state) this.state = state
        else this.state = 'idle'
    }
}
