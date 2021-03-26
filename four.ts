//Observable Pattern => {pub, sub}
type Listener<EventType> = (event: EventType) => void;
function createObservers<EventType>(): {
  subscribe: (listener: Listener<EventType>) => () => void;
  publish: (event: EventType) => void;
} {
  let listeners: Listener<EventType>[] = [];
  return {
    subscribe: (listener: Listener<EventType>): (() => void) => {
      listeners.push(listener);
      return () => {
        listeners = listeners.filter((element) => element !== listener);
      };
    },
    publish: (event: EventType) => {
      listeners.forEach((listener) => listener(event));
    },
  };
}

interface IBeforeSetEvent<T> {
  previousValue: T;
  incomingValue: T;
}
interface IAfterSetEvent<T> {
  currentValue: T;
}
interface IPerson {
  id: string;
  name: string;
  age: number;
}
interface IBaseRecord {
  id: string;
}
interface Database<T extends IBaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
  onBeforeSet(listener: Listener<IBeforeSetEvent<T>>): () => void;
  onAfterSet(listener: Listener<IAfterSetEvent<T>>): void;
}

function createInMemoryDatabase<T extends IBaseRecord>() {
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};

    private beforeSetListeners = createObservers<IBeforeSetEvent<T>>();
    private afterSetListeners = createObservers<IAfterSetEvent<T>>();

    static instance: InMemoryDatabase = new InMemoryDatabase();
    private constructor() {}
    set(newValue: T) {
      //publish
      this.beforeSetListeners.publish({
        previousValue: this.db[newValue.id],
        incomingValue: newValue,
      });
      this.db[newValue.id] = newValue;
      this.afterSetListeners.publish({
        currentValue: this.db[newValue.id],
      });
    }
    get(id: string) {
      return this.db[id];
    }

    //subscribe to the listeners
    onBeforeSet(listener: Listener<IBeforeSetEvent<T>>): () => void {
      return this.beforeSetListeners.subscribe(listener);
    }

    onAfterSet(listener: Listener<IAfterSetEvent<T>>) {
      return this.afterSetListeners.subscribe(listener);
    }
  }
  return InMemoryDatabase;
}

const PersonDatabase = createInMemoryDatabase<IPerson>();
const unsubscribeFromBeforeSet = PersonDatabase.instance.onBeforeSet(
  ({ previousValue, incomingValue }) => {
    console.log(
      "Previous Value: ",
      previousValue,
      "\n",
      "Incoming Value: ",
      incomingValue,
      "\n"
    );
  }
);
const unsubcribeFromAfterSet = PersonDatabase.instance.onAfterSet(
  ({ currentValue }) => {
    console.log(" Current value: ", currentValue, "\n");
  }
);
PersonDatabase.instance.set({
  id: "random",
  name: "Frank",
  age: 42,
});
unsubcribeFromAfterSet();
unsubscribeFromBeforeSet();
console.log("After unsubscribing...");
PersonDatabase.instance.set({
  id: "def",
  name: "Camry",
  age: 19,
});
