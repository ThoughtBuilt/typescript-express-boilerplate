import type { Db } from "mongodb";
import { inherit } from "../lib/object-utils";

export interface User {
  id: number;
  name: string;
}

export interface UserService {
  getById(id: number): Promise<User | undefined>;
  listAllUsers(): Promise<User[]>;
}

type DbUserServiceDependencies = {
  db: Db;
};

export class DbUserService implements UserService {
  constructor(private srv: DbUserServiceDependencies) {}

  async getById(id: number) {
    const result = await this.srv.db.collection("users").findOne({ id });
    return result ? <User>inherit(UserImpl.prototype, result) : undefined;
  }

  async listAllUsers() {
    const collection = this.srv.db.collection("users");
    const dbUsers = await collection.find().toArray();
    let result: User[];
    if (dbUsers.length) {
      result = dbUsers.map((v) => inherit(UserImpl.prototype, v) as User);
    } else {
      result = Array.from(testUsers.values());
      collection.insertMany(result);
    }
    return result;
  }
}

export class TestUserService implements UserService {
  async getById(id: number) {
    return testUsers.get(id);
  }
  async listAllUsers() {
    return Array.from(testUsers.values());
  }
}

class UserImpl implements User {
  constructor(public id: number, public name: string) {}
}

const testUsers = new Map<number, User>([
  [1, new UserImpl(1, "John Smith")],
  [2, new UserImpl(2, "Susan Doe")],
  [3, new UserImpl(3, "John Q Public")],
]);
