export const DateUtils = {
  formatDate(date: Date | string): string {
    const d = new Date(date)
    return d.toLocaleString()
  },
}
