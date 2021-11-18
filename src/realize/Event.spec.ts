import { _Event } from './Event';

describe('_Event', () => {
  const hasAddLinsten = Object.prototype.hasOwnProperty.call(_Event, 'addLinsten');
  const hasOnce = Object.prototype.hasOwnProperty.call(_Event, 'once');
  const hasRemoveLinsten = Object.prototype.hasOwnProperty.call(_Event, 'removeLinsten');
  const hasTrigger = Object.prototype.hasOwnProperty.call(_Event, 'trigger');

  it('_Event.addLinsten should exist', () => {
    expect(hasAddLinsten).toBeTruthy();
  });
  it('_Event.once should exist', () => {
    expect(hasOnce).toBeTruthy();
    describe('_Event.once', () => {});
  });
  it('_Event.removeLinsten should exist', () => {
    expect(hasRemoveLinsten).toBeTruthy();
  });
  it('_Event.trigger should exist', () => {
    expect(hasTrigger).toBeTruthy();
  });
});
