import { PREFIX } from "./constants";

export default function buildClassName(className: string) {
  return className
    .split(" ")
    .map(name => PREFIX + name)
    .join(" ");
}
