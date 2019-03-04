import IMousePos from '../models/IMousePos.model';
import { scale } from '../config/config';

export function getMousePosition(elem: HTMLElement, event: any): IMousePos {
  const { clientX, clientY } = event
  const { left, top } = elem.getBoundingClientRect()
  const newPos = {
    x: Math.floor((clientX - left) / scale),
    y: Math.floor((clientY - top) / scale)
  }

  return newPos
}
