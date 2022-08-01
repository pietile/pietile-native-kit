import { UIManager } from 'react-native';

interface Rect {
  left: number;
  top: number;
  width: number;
  height: number;
}

export function measureInWindow(node: number): Promise<Rect> {
  return new Promise<Rect>((resolve) => {
    UIManager.measureInWindow(node, (left, top, width, height) => {
      resolve({ left, top, width, height });
    });
  });
}

export function measureLayout(node: number, relativeToNativeNode: number): Promise<Rect> {
  return new Promise<Rect>((resolve, reject) => {
    UIManager.measureLayout(node, relativeToNativeNode, reject, (left, top, width, height) => {
      resolve({ left, top, width, height });
    });
  });
}

export function viewIsDescendantOf(node: number, innerViewNode: number): Promise<boolean> {
  return new Promise((resolve) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (UIManager as any).viewIsDescendantOf(node, innerViewNode, (isAncestor: boolean) => {
      resolve(isAncestor);
    });
  });
}
