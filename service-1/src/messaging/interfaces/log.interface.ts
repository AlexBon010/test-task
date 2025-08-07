export interface ILog {
	level: 'info' | 'warn' | 'error'
	message: string
	timestamp: string
	service: string
}
