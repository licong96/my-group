
function* doSomething() {
  console.log('start');

  yield;

  console.log('finish')

  console.log('end')
}

let fun = doSomething();

fun.next();
fun.next();