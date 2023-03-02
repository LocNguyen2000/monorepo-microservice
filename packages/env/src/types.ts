export type KeyOf<T> = keyof T extends never ? string : keyof T;

export type NestedValueOf<Obj, Key> = Obj extends object
  ? Key extends `${infer Parent}.${infer Leaf}`
    ? Parent extends keyof Obj
      ? NestedValueOf<Obj[Parent], Leaf>
      : unknown
    : Key extends keyof Obj
    ? Obj[Key]
    : unknown
  : unknown;
