//Factory pattern
//TO DO: implement the database of the one with factory pattern
interface IPerson{
    id: string;
    name: string;
    age: number;
}
interface BaseRecord{
    id: string;
}

interface Database<T extends BaseRecord>{
    set(newValue: T): void;
    get(id: string): T|undefined;
}

function createDatabase<T extends BaseRecord>(){
    class InMemoryDatabase implements Database<T>{
        private db: Record<string, T> = {};
        set(newValue: T){
            this.db[newValue.id] = newValue;
        }
        get(id: string){
            return this.db[id];
        }
    }
    return InMemoryDatabase;
}
//just to show that you can build classes in runtime;
const personDbCreator = createDatabase<IPerson>();
const PersonDb = new personDbCreator();

PersonDb.set({id: "random", age: 40, name: "Frank"});
console.log(PersonDb.get("random"));
