//Singleton (Simillar to redux)
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
        private db:Record<string, T> = {};
        //you just have to use onlu one instance of the clas: like redux store
        //and here, the instance variable is the store
        static instance:InMemoryDatabase = new InMemoryDatabase();
        private constructor(){

        }

        set(newValue: T){
            this.db[newValue.id] = newValue;
        }
        get(id: string){
            return this.db[id]
        }
    }
    return InMemoryDatabase;
}
const PersonDatabase = createDatabase<IPerson>();

PersonDatabase.instance.set({id: "random", name: "Ronnie", age: 29});
console.log(PersonDatabase.instance.get("random"))