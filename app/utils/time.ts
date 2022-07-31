export function formatTime(time: number): string {
	const hours = Math.floor(time / (60 * 60))
	const minutes = Math.floor(time / 60 - hours * 60)
	const seconds = Math.floor(time - minutes * 60 - hours * 60*60)
	return `${hours}h ${minutes}min ${seconds}s`
}