interface String {
  capitalize(): string
}

String.prototype.capitalize = function (): string {
  const separators = [' ', '-']
  let str = this.toString().toLowerCase()
  separators.forEach((separator) => {
    str = str
      .split(separator)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(separator)
  })
  return str
}
