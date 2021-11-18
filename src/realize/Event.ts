type Fn = (...args: any[]) => void;
interface ClientList {
  [key: string]: Fn[];
}
export const _Event = (() => {
  const clientList: ClientList = {};

  function addLinsten(event: string, fn: Fn) {
    if (event in clientList) {
      clientList[event].push(fn);
    } else {
      clientList[event] = [fn];
    }
  }

  function trigger(event: string, ...args: any[]) {
    const eventFns = clientList[event];

    if (eventFns) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      eventFns.forEach(fn => fn.call(_Event, ...args));
    } else {
      return false;
    }
    return true;
  }

  function removeLinsten(event: string, fn: Fn) {
    if (event in clientList) {
      const eventFns = clientList[event];

      if (!eventFns) return;
      for (let index = eventFns.length - 1; index >= 0; index--) {
        if (fn === eventFns[index]) {
          eventFns.splice(index, 1);
        }
      }
      eventFns.length > 0 ? (clientList[event] = eventFns) : delete clientList[event];
    }
  }

  function once(event: string, fn: Fn) {
    function cb(...args: any[]) {
      fn(args);
      removeLinsten(event, cb);
    }

    if (event in clientList) {
      clientList[event].push(cb);
    } else {
      clientList[event] = [cb];
    }
  }
  return {
    addLinsten,
    trigger,
    removeLinsten,
    once
  };
})();
