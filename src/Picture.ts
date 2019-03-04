import IPixel from './models/IPixel.model'

class Picture {
  private width: number
  private height: number
  private pixels: string[]

  constructor(width: number, height: number, pixels: string[]) {
    this.width = width
    this.height = height
    this.pixels = pixels
  }

  public static empty(width: number, height: number, color: string) {
    const pixels: string[] = new Array(width * height).fill(color)
    return new Picture(width, height, pixels)
  }

  public pixel(x: number, y: number): string {
    return this.pixels[x + y * this.width]
  }

  public draw(newPixels: IPixel[]) {
    const copy: string[] = this.pixels.slice()
    newPixels.forEach(({ x, y, color }) => {
      copy[x + y * this.width] = color
    })
    return new Picture(this.width, this.height, copy)
  }
}

export default Picture
