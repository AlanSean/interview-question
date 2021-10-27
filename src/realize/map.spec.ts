import './map';

describe('newMap', function () {
  const arr = [1, 2, 3];

  it('arr.newMap should work fine.', function () {
    const newArr = arr.newMap(i => i + 1);

    expect(newArr).toStrictEqual([2, 3, 4]);
  });

  it('arr.newMap should returns undefined array.', function () {
    const newArr = arr.newMap(() => {});

    expect(newArr).toStrictEqual([undefined, undefined, undefined]);
  });

  it('arr.newMap should returns string array.', function () {
    const newArr = arr.newMap(i => {
      return String(i);
    });

    expect(newArr).toStrictEqual(['1', '2', '3']);
  });

  it('arr.newMap should this === arr [1, 2, 3].', function () {
    arr.newMap(function (this: any, i) {
      expect(this).toStrictEqual(arr);
      return String(i);
    });
  });

  it('arr.newMap should this === arr1 [0].', function () {
    const arr1 = [0];
    arr.newMap(function (this: any, i) {
      expect(this).toStrictEqual(arr1);
      return String(i);
    }, arr1);
  });
});
