export function shuffleArray<T>(arr: Array<T>): Array<T> {
  const newArr = [...arr];
  let currIdx = newArr.length;
  while (currIdx != 0) {
    let randIdx = Math.floor(Math.random() * currIdx);
    currIdx--;
    [newArr[currIdx], newArr[randIdx]] = [newArr[randIdx], newArr[currIdx]];
  }
  return newArr;
}
