//Sigleton with adapter pattern
//run : yarn ts-node seven.ts
import * as fs from "fs";
export interface RecordHandler<T> {
  addRecord(person: T): void;
}

export function loader<T>(
  filePath: string,
  recordHandler: RecordHandler<T>
): void {
  const records: T[] = JSON.parse(fs.readFileSync(filePath).toString());
  records.forEach((record) => recordHandler.addRecord(record));
}

interface IPerson {
  id: string;
  name: string;
  age: number;
}
interface BaseRecord {
  id: string;
}
interface Database<T extends BaseRecord> {
  set(newValue: T): void;
  get(id: string): T | undefined;
}
function createDatabase<T extends BaseRecord>() {
  class InMemoryDatabase implements Database<T> {
    private db: Record<string, T> = {};
    //you just have to use onlu one instance of the clas: like redux store
    //and here, the instance variable is the store
    static instance: InMemoryDatabase = new InMemoryDatabase();
    private constructor() {}

    set(newValue: T) {
      this.db[newValue.id] = newValue;
    }
    get(id: string) {
      return this.db[id];
    }
    //visitor
    visit(visitor: (element: T) => void): void {
      //value will be automatically passed thorugh the callback
      Object.keys(this.db)
        .map((key) => this.db[key])
        .forEach(visitor);
    }
  }
  return InMemoryDatabase;
}
const PersonDatabase = createDatabase<IPerson>();
//adapter
class PersonDBAdapter implements RecordHandler<IPerson> {
  addRecord(person: IPerson) {
    PersonDatabase.instance.set(person);
  }
}
loader("./person-data.json", new PersonDBAdapter());
PersonDatabase.instance.visit((person) => console.log(person.name));
