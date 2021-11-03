import { Promise1 } from './promise';

describe('Promise1', function () {
  it('Promise1 should work fine.', function () {
    new Promise1((relove, reject) => {
      try {
        setTimeout(() => {
          relove(1);
        }, 1000);
      } catch (error) {
        reject(error);
      }
    })
      .then(res => {
        console.log('res', res);
        expect(res).toStrictEqual(1);
      })
      .catch(err => {
        console.log(err);
      });
  });
});
