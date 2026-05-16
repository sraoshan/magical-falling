export function rand(min, max) {

  return Math.random()
    * (max - min)
    + min;

}

export function pick(arr) {

  return arr[
    Math.floor(
      Math.random() * arr.length
    )
  ];

}