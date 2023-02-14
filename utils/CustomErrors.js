export class VerifyError extends Error {
    constructor(message) {
      super(message); // (1)
      this.name = "VerifyError"; // (2)
    }
}