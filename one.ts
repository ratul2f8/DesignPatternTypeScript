//design in-memory database
interface IPerson{
    id: string;
    name: string;
    age: number
}

interface BaseRecord{
    id: string;
}

//whatever data type you are gonna deal with(Generic T) it must have the property of the interface
//BaseRecord
interface Database<T extends BaseRecord>{
    set(newValue: T): void;
    get(id: string): T| undefined
}

class InMemoryDatabase<T extends BaseRecord> implements Database<T>{
    private db:Record<string, T> = {};
    
    set(newValue: T): void{
        this.db[newValue.id] = newValue
    }
    
    get(id: string):T{
        return this.db[id];
    }
}

const personDB = new InMemoryDatabase<IPerson>();
personDB.set({id: "random", name: "John", age: 45});

console.log(personDB.get("random"))