export const isEmpty = (data: any): boolean => !data

export const humanize = (date: string) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  } as Intl.DateTimeFormatOptions
  const currentTime = new Date()
  const diffTime = Math.abs(currentTime.getTime() - new Date(date).getTime())
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  const diffHours = Math.floor((diffTime - diffDays * 1000 * 60 * 60 * 24) / (1000 * 60 * 60))
  const diffMins = Math.floor((diffTime - diffDays * 1000 * 60 * 60 * 24 - diffHours * 1000 * 60 * 60) / (1000 * 60))
  if (diffDays < 2) {
    if (diffDays < 1) {
      if (diffHours >= 1) {
        return `${diffHours.toFixed(0)}hrs ago`
      }
      if (diffMins >= 1) {
        return `${diffMins.toFixed(0)}Mins ago`
      }
      return "Just now"
    }
    return "1d ago"
  }
  if (diffDays >= 2) {
    return new Date(date).toLocaleDateString("en-US", options)
  }
}
