/* eslint-env jest */
import { preProcess } from '../run';

test('preProcess consts', () => {
  console.log(preProcess('const a = 12'));
});

test('multiple vars', () => {
  expect(() => {
    preProcess('var a, b;');
  }).not.toThrow();
});
