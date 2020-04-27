export interface User {
  id: number;
  name: string;
}

export interface UserService {
  getById(id: number): Promise<User | undefined>;
  listAllUsers(): Promise<User[]>;
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
