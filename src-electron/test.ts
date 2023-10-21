class Sampler {
  greeting: string;
  constructor(message: string) {
  this.greeting = message;
  }
  greet() {
  return "Hello, " + this.greeting;
  }
  }


  const sampler = new Sampler("world");
