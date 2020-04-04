/**
 * Promise wrappers for UIManager methods
 */

import { UIManager } from 'react-native';

export function measureInWindow(node) {
  return new Promise((resolve) =>
    UIManager.measureInWindow(node, (left, top, width, height) =>
      resolve({ left, top, width, height }),
    ),
  );
}

export function measureLayout(node, relativeToNativeNode) {
  return new Promise((resolve, reject) =>
    UIManager.measureLayout(node, relativeToNativeNode, reject, (left, top, width, height) =>
      resolve({ left, top, width, height }),
    ),
  );
}

export function viewIsDescendantOf(node, innerViewNode) {
  return new Promise((resolve) =>
    UIManager.viewIsDescendantOf(node, innerViewNode, (isAncestor) => resolve(isAncestor)),
  );
}
